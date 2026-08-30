"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAdminConfig() {
  let config = await prisma.adminConfig.findUnique({ where: { id: "default" } });
  if (!config) {
    config = await prisma.adminConfig.create({ data: { id: "default" } });
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

    // Update only PanelSocial services with the global markup for now
    // Ads4U is hardcoded to x3 in the database per user request
    const services = await prisma.service.findMany({ 
      where: { provider: "PANELSOCIAL" },
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
    const config = await getAdminConfig();
    const markup = config.globalMarkup;

    // Fetch from Ads4U
    const ads4uKey = process.env.ADS4U_API_KEY || "";
    const ads4uUrl = process.env.ADS4U_URL || "";
    let ads4uServices: any[] = [];
    
    if (ads4uKey && ads4uUrl) {
      const res = await fetch(`${ads4uUrl}?key=${ads4uKey}&action=services`);
      ads4uServices = await res.json();
    }

    // Fetch from PanelSocial
    const panelKey = process.env.PROVIDER_API_KEY || "";
    const panelUrl = process.env.PROVIDER_URL || "";
    let panelServices: any[] = [];
    
    if (panelKey && panelUrl) {
      const res = await fetch(`${panelUrl}?key=${panelKey}&action=services`);
      panelServices = await res.json();
    }

    // Combine logic (IG/LINE goes to PanelSocial, rest to Ads4U)
    const newServiceData = [];

    // Map Ads4U
    if (Array.isArray(ads4uServices)) {
      for (const s of ads4uServices) {
        const category = String(s.category).toLowerCase();
        if (category.includes('instagram') || category.includes('ig') || category.includes('line')) {
          continue; // skip IG/LINE for Ads4U
        }
        const name = String(s.name).toLowerCase();
        
        // Exclude categories handled by PanelSocial
        if (
          category.includes('instagram') || 
          category.includes('ig') || 
          category.includes('line') ||
          category.includes('คอมเม้นต์') ||
          category.includes('รีวิว') ||
          name.includes('ผู้ชาย') ||
          name.includes('ผู้หญิง') ||
          name.includes('คนไทย')
        ) {
          continue;
        }
        
        newServiceData.push({
          originalId: s.service,
          provider: "ADS4U",
          name: s.name,
          category: s.category,
          originalPrice: parseFloat(s.rate),
          price: parseFloat(s.rate) * 3, // Hardcoded to x3 per user request
          min: parseInt(s.min),
          max: parseInt(s.max),
          type: s.type || "Default"
        });
      }
    }

    // (Removed duplicate fetch for PanelSocial services)
    // Map PanelSocial
    if (Array.isArray(panelServices)) {
      for (const s of panelServices) {
        const category = String(s.category).toLowerCase();
        const name = String(s.name).toLowerCase();
        // Route IG, LINE, and any premium Thai Comment services to PanelSocial
        if (
          category.includes('instagram') || 
          category.includes('ig') || 
          category.includes('line') ||
          category.includes('คอมเม้นต์') ||
          category.includes('รีวิว') ||
          name.includes('ผู้ชาย') ||
          name.includes('ผู้หญิง') ||
          name.includes('คนไทย')
        ) {
          newServiceData.push({
            originalId: s.service,
            provider: "PANELSOCIAL",
            name: s.name,
            category: s.category,
            originalPrice: parseFloat(s.rate),
            price: parseFloat(s.rate) * markup,
            min: parseInt(s.min),
            max: parseInt(s.max),
            type: s.type || "Default"
          });
        }
      }
    }

    if (newServiceData.length === 0) {
      return { success: false, error: "ไม่พบข้อมูลจาก Provider หรือ API Key ผิดพลาด" };
    }

    // In a real prod environment we'd carefully upsert to avoid changing local IDs.
    // For this implementation, deleting all and recreating is fastest but breaks existing Order references.
    // Let's do an upsert approach instead to be safe with existing orders.
    
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

    // Insert update logs (keep top 50 to avoid bloat)
    if (updateLogs.length > 0) {
      await prisma.serviceUpdate.createMany({
        data: updateLogs
      });
      
      // Cleanup old logs (optional, simple logic: just delete older than 30 days)
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
