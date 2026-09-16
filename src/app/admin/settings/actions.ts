"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminConfig() {
  let config = await prisma.adminConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    // Set default markup to 2.0 (x2)
    config = await prisma.adminConfig.create({ data: { id: "default", globalMarkup: 2.0 } });
  }
  return config;
}

export async function updateMarkup(markup: number) {
  try {
    // Update config
    await prisma.adminConfig.update({
      where: { id: "default" },
      data: { globalMarkup: markup }
    });

    // Update all services to the new markup
    const services = await prisma.service.findMany({ 
      select: { id: true, originalPrice: true }
    });
    
    // Process in batches
    const batchSize = 100;
    for (let i = 0; i < services.length; i += batchSize) {
      const batch = services.slice(i, i + batchSize);
      await prisma.$transaction(
        batch.map(s => prisma.service.update({
          where: { id: s.id },
          data: { price: s.originalPrice * markup }
        }))
      );
    }

    revalidatePath("/admin/settings");
    revalidatePath("/dashboard/services");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function syncServices() {
  try {
    // Default to x2 if config doesn't exist
    const config = await getAdminConfig();
    const markup = config.globalMarkup || 2.0;

    // Fetch from PanelSocial only
    const panelKey = process.env.PROVIDER_API_KEY || "";
    const panelUrl = process.env.PROVIDER_URL || "";
    let panelServices: any[] = [];
    
    if (panelKey && panelUrl) {
      const res = await fetch(`${panelUrl}?key=${panelKey}&action=services`);
      panelServices = await res.json();
    }

    if (!Array.isArray(panelServices) || panelServices.length === 0) {
      return { success: false, error: "ไม่พบข้อมูลจาก Provider หรือ API Key ของ PanelSocial ผิดพลาด" };
    }

    const newServiceData = [];

    // Map PanelSocial (Fetch ALL services without filtering)
    for (const s of panelServices) {
      newServiceData.push({
        originalId: s.service,
        provider: "PANELSOCIAL",
        name: s.name,
        category: s.category,
        originalPrice: parseFloat(s.rate),
        price: parseFloat(s.rate) * markup, // Multiply by markup (default x2)
        min: parseInt(s.min),
        max: parseInt(s.max),
        
      });
    }

    if (newServiceData.length === 0) {
      return { success: false, error: "ไม่สามารถแปลงข้อมูลบริการจาก Provider ได้" };
    }
    
    // Get existing services by originalId + provider
    const existing = await prisma.service.findMany({ select: { id: true, originalId: true, provider: true, originalPrice: true, price: true } });
    const existingMap = new Map(existing.map(e => [`${e.provider}_${e.originalId}`, e]));

    let updated = 0;
    let added = 0;
    const updateLogs: any[] = [];

    for (const s of newServiceData) {
      const key = `${s.provider}_${s.originalId}`;
      const existingService = existingMap.get(key);

      if (existingService) {
        // Check for price changes
        if (existingService.originalPrice !== s.originalPrice) {
          const isPriceUp = s.originalPrice > existingService.originalPrice;
          updateLogs.push({
            serviceId: existingService.id,
            serviceName: s.name,
            type: isPriceUp ? "PRICE_UP" : "PRICE_DOWN",
            oldPrice: existingService.price,
            newPrice: s.price
          });
        }

        await prisma.service.update({
          where: { id: existingService.id },
          data: {
            name: s.name,
            category: s.category,
            originalPrice: s.originalPrice,
            price: s.price,
            min: s.min,
            max: s.max
          }
        });
        updated++;
      } else {
        const created = await prisma.service.create({ data: s });
        updateLogs.push({
          serviceId: created.id,
          serviceName: s.name,
          type: "NEW",
          oldPrice: null,
          newPrice: s.price
        });
        added++;
      }
    }

    // Identify services that exist in DB but are no longer provided by PanelSocial
    const newServiceIds = new Set(newServiceData.map(s => `${s.provider}_${s.originalId}`));
    const servicesToDelete = existing.filter(e => e.provider !== "PANELSOCIAL" || !newServiceIds.has(`${e.provider}_${e.originalId}`));
    
    if (servicesToDelete.length > 0) {
      // NOTE: We cannot simply delete them if they are linked to Orders.
      // Usually, it's safer to just let them be or mark as hidden. 
      // For this cleanup since we are migrating strictly to PanelSocial, 
      // if an order references an Ads4U service, deleting the service will fail due to foreign key constraints.
      // So we will attempt to delete them, but ignore errors for linked services.
      for (const s of servicesToDelete) {
        try {
          await prisma.service.delete({ where: { id: s.id } });
        } catch (e) {
          // Ignore foreign key errors, just leave the service in the DB.
        }
      }
    }

    // Insert update logs (keep top 50 to avoid bloat)
    if (updateLogs.length > 0) {
      await prisma.serviceUpdate.createMany({
        data: updateLogs
      });
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      await prisma.serviceUpdate.deleteMany({
        where: { createdAt: { lt: thirtyDaysAgo } }
      });
    }

    revalidatePath("/admin/settings");
    revalidatePath("/dashboard/services");

    return { success: true, message: `ซิงค์สำเร็จ! อัปเดต ${updated} รายการ, เพิ่มใหม่ ${added} รายการ` };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
