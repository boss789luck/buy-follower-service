const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

// Data definition for all 14 Rate Cards
// Minimum profit >= 2x cost guaranteed on all tiers!
const rateCardsData = [
  {
    id: '01_facebook_likes',
    platform: 'FACEBOOK',
    platformBadge: '🔵 FACEBOOK OFFICIAL SERVICES',
    title: 'บริการปั๊มไลค์โพสต์ & รูปภาพ',
    subtitle: 'เพิ่มยอดไลค์ไว เสริมความน่าเชื่อถือให้แบรนด์ ดันโพสต์ติดหน้าฟีด ปลอดภัย 100%',
    theme: {
      accent: '#1877F2',
      accentGlow: 'rgba(24, 119, 242, 0.35)',
      gradient: 'linear-gradient(135deg, #0B1528 0%, #070B14 100%)',
      badgeBg: 'rgba(24, 119, 242, 0.15)',
      badgeBorder: 'rgba(24, 119, 242, 0.4)'
    },
    col1: {
      name: '🇹🇭 ไลค์คนไทยแท้ (บัญชีมีตัวตน)',
      desc: 'โปรไฟล์คนไทย มีรูป มีเพื่อน เป็นธรรมชาติ ดันฟีดในไทยดีเยี่ยม',
      costPer1k: 1500,
      tiers: [
        { qty: '1,000 ไลก์', price: '6,750', badge: 'เริ่มต้น' },
        { qty: '2,000 ไลก์', price: '12,000', badge: 'ประหยัด 11%' },
        { qty: '5,000 ไลก์', price: '27,000', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ไลก์', price: '49,500', badge: 'ประหยัด 27%' },
        { qty: '20,000 ไลก์', price: '90,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '🌍 ไลค์ต่างชาติ พรีเมียม (ราคาประหยัด)',
      desc: 'ยอดขึ้นไวใน 1-3 ชม. เหมาะสำหรับเพิ่มตัวเลข เสริมเครดิตเพจให้ดูยิ่งใหญ่',
      costPer1k: 85,
      tiers: [
        { qty: '1,000 ไลก์', price: '390', badge: 'เริ่มต้น' },
        { qty: '2,000 ไลก์', price: '680', badge: 'ประหยัด 13%' },
        { qty: '5,000 ไลก์', price: '1,550', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ไลก์', price: '2,850', badge: 'ประหยัด 27%' },
        { qty: '20,000 ไลก์', price: '5,100', badge: '👑 คุ้มสุด (เซฟ 35%)' }
      ]
    },
    features: [
      { icon: '🔒', title: 'ปลอดภัยสูง', desc: 'ใช้แค่ลิงก์โพสต์ ไม่ขอรหัสผ่าน' },
      { icon: '⚡', title: 'เริ่มงานรวดเร็ว', desc: 'ระบบอัตโนมัติทำงาน 0-6 ชม.' },
      { icon: '🛡️', title: 'รับประกันคุณภาพ', desc: 'ยอดเสถียร ไม่ลด มั่นใจได้' },
      { icon: '🚀', title: 'เพิ่มการเข้าถึง', desc: 'ช่วยดันโพสต์เปิดค่าการมองเห็น' }
    ]
  },
  {
    id: '02_facebook_followers',
    platform: 'FACEBOOK',
    platformBadge: '🔵 FACEBOOK GROWTH SERVICES',
    title: 'บริการเพิ่มผู้ติดตาม แฟนเพจ & โปรไฟล์',
    subtitle: 'สร้างความน่าเชื่อถือระดับมืออาชีพ เพิ่มฐานลูกค้า ขยายการรับรู้แบรนด์อย่างยั่งยืน',
    theme: {
      accent: '#0A84FF',
      accentGlow: 'rgba(10, 132, 255, 0.35)',
      gradient: 'linear-gradient(135deg, #09172E 0%, #060A14 100%)',
      badgeBg: 'rgba(10, 132, 255, 0.15)',
      badgeBorder: 'rgba(10, 132, 255, 0.4)'
    },
    col1: {
      name: '🇹🇭 ผู้ติดตามคนไทยแท้ (เพจ / เฟสส่วนตัว)',
      desc: 'คนไทยมีตัวตนจริง เพิ่มความไว้วางใจในการซื้อสินค้า เพิ่มยอดขาย',
      costPer1k: 800,
      tiers: [
        { qty: '1,000 คน', price: '3,600', badge: 'เริ่มต้น' },
        { qty: '2,000 คน', price: '6,400', badge: 'ประหยัด 11%' },
        { qty: '5,000 คน', price: '14,400', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 คน', price: '26,400', badge: 'ประหยัด 27%' },
        { qty: '20,000 คน', price: '48,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '🌍 ผู้ติดตามต่างชาติ (ยอดเสถียร มีประกัน)',
      desc: 'เน้นขยายตัวเลขให้ดูมีผู้ติดตามหลักหมื่น-หลักแสนในเวลาอันรวดเร็ว',
      costPer1k: 195,
      tiers: [
        { qty: '1,000 คน', price: '890', badge: 'เริ่มต้น' },
        { qty: '2,000 คน', price: '1,590', badge: 'ประหยัด 11%' },
        { qty: '5,000 คน', price: '3,500', badge: '🔥 ยอดนิยม (เซฟ 21%)' },
        { qty: '10,000 คน', price: '6,400', badge: 'ประหยัด 28%' },
        { qty: '20,000 คน', price: '11,700', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    features: [
      { icon: '🏢', title: 'รองรับเพจ & โปรไฟล์', desc: 'เพิ่มได้ทั้ง Fanpage และ Facebook ส่วนตัว' },
      { icon: '♻️', title: 'มีรับประกัน 30 วัน', desc: 'หากมียอดลด ระบบรีฟิลเติมให้ฟรี' },
      { icon: '🔒', title: 'ไร้ความเสี่ยง', desc: 'ใช้เพียงลิงก์เพจ/โปรไฟล์เท่านั้น' },
      { icon: '⭐', title: 'ดันคะแนนเพจ', desc: 'ช่วยให้เพจดูน่าเชื่อถือและค้นหาง่ายขึ้น' }
    ]
  },
  {
    id: '03_facebook_views_reactions',
    platform: 'FACEBOOK',
    platformBadge: '🔵 FACEBOOK ENGAGEMENT',
    title: 'บริการวิวคลิป REELS & อีโมจิความรู้สึก',
    subtitle: 'ดันคลิปวิดีโอให้ไวรัล กระตุ้นเอนเกจเมนต์ด้วยไลค์แสดงอารมณ์ ❤️🤗😆😮',
    theme: {
      accent: '#2060FF',
      accentGlow: 'rgba(32, 96, 255, 0.35)',
      gradient: 'linear-gradient(135deg, #0D162B 0%, #060914 100%)',
      badgeBg: 'rgba(32, 96, 255, 0.15)',
      badgeBorder: 'rgba(32, 96, 255, 0.4)'
    },
    col1: {
      name: '🎬 ยอดวิวคลิป Facebook Reels & Video',
      desc: 'ดันวิดีโอขึ้นฟีด Reels ฟีด Watch เพิ่มโอกาสเปิดการมองเห็นสาธารณะ',
      costPer1k: 50,
      tiers: [
        { qty: '5,000 วิว', price: '1,150', badge: 'เริ่มต้น' },
        { qty: '10,000 วิว', price: '2,000', badge: 'ประหยัด 13%' },
        { qty: '20,000 วิว', price: '3,600', badge: '🔥 ยอดนิยม (เซฟ 22%)' },
        { qty: '50,000 วิว', price: '8,250', badge: 'ประหยัด 28%' },
        { qty: '100,000 วิว', price: '15,000', badge: '👑 สุดคุ้ม (เซฟ 35%)' }
      ]
    },
    col2: {
      name: '❤️ ไลค์แสดงความรู้สึก อีโมจิ คนไทยแท้',
      desc: 'เลือกได้: หัวใจ ❤️ / ยิ้ม 🤗 / หัวเราะ 😆 / ว้าว 😮 ดันความรู้สึกสมจริง',
      costPer1k: 1500,
      tiers: [
        { qty: '500 อีโมจิ', price: '3,400', badge: 'เริ่มต้น' },
        { qty: '1,000 อีโมจิ', price: '6,750', badge: 'ประหยัด 10%' },
        { qty: '2,000 อีโมจิ', price: '12,000', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '5,000 อีโมจิ', price: '27,000', badge: 'ประหยัด 26%' },
        { qty: '10,000 อีโมจิ', price: '49,500', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    features: [
      { icon: '✨', title: 'เลือกอารมณ์ได้', desc: 'ระบุอิโมจิที่ต้องการได้ตามใจชอบ' },
      { icon: '🚀', title: 'ดันคลิปไวรัล', desc: 'เพิ่มยอดดู ดึงดูดคนดูคลิปจนจบ' },
      { icon: '📈', title: 'เพิ่มอัตราการเข้าถึง', desc: 'อัลกอริทึมดันขึ้นแนะนำอัตโนมัติ' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ไม่เสี่ยง ไม่โดนบล็อก ทำงานเป็นธรรมชาติ' }
    ]
  },
  {
    id: '04_facebook_group_live',
    platform: 'FACEBOOK',
    platformBadge: '🔵 FACEBOOK COMMUNITY & LIVE',
    title: 'บริการดึงคนเข้ากลุ่ม & วิวไลฟ์สด FACEBOOK',
    subtitle: 'สร้างคอมมูนิตี้ให้คึกคัก และกระตุ้นยอดคนดูไลฟ์สดให้ขายดียิ่งขึ้นแบบเรียลไทม์',
    theme: {
      accent: '#0066FF',
      accentGlow: 'rgba(0, 102, 255, 0.35)',
      gradient: 'linear-gradient(135deg, #0A1326 0%, #050812 100%)',
      badgeBg: 'rgba(0, 102, 255, 0.15)',
      badgeBorder: 'rgba(0, 102, 255, 0.4)'
    },
    col1: {
      name: '👥 ดึงสมาชิกเข้ากลุ่มเฟซบุ๊ก (Group Members)',
      desc: 'เพิ่มจำนวนสมาชิกในกลุ่ม สร้างสังคมที่ดูน่าเชื่อถือและมีผู้คนหนาแน่น',
      costPer1k: 250,
      tiers: [
        { qty: '1,000 สมาชิก', price: '1,150', badge: 'เริ่มต้น' },
        { qty: '2,000 สมาชิก', price: '2,000', badge: 'ประหยัด 13%' },
        { qty: '5,000 สมาชิก', price: '4,500', badge: '🔥 ยอดนิยม (เซฟ 22%)' },
        { qty: '10,000 สมาชิก', price: '8,250', badge: 'ประหยัด 28%' },
        { qty: '20,000 สมาชิก', price: '15,000', badge: '👑 คุ้มสุด (เซฟ 35%)' }
      ]
    },
    col2: {
      name: '🔴 เพิ่มคนดูไลฟ์สด FB Live (กระตุ้นยอดขาย)',
      desc: 'คนดูอยู่ยาวตลอดการไลฟ์ สร้างบรรยากาศร้านค้าให้ดูมีคนสนใจสั่งซื้อ',
      costPer1k: 350,
      tiers: [
        { qty: '100 คน (30 นาที)', price: '390', badge: 'เริ่มต้น' },
        { qty: '200 คน (60 นาที)', price: '690', badge: 'ประหยัด 12%' },
        { qty: '500 คน (60 นาที)', price: '1,590', badge: '🔥 ยอดนิยม (เซฟ 18%)' },
        { qty: '1,000 คน (60 นาที)', price: '2,900', badge: 'ประหยัด 25%' },
        { qty: '2,000 คน (60 นาที)', price: '5,250', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    features: [
      { icon: '⏱️', title: 'เกาะติดไลฟ์สด', desc: 'ยอดคนดูคงที่ตลอดระยะเวลาที่สั่ง' },
      { icon: '🛒', title: 'กระตุ้นการตัดสินใจ', desc: 'ลูกค้ารู้สึกว่าสินค้าขายดีและต้องรีบ CF' },
      { icon: '👥', title: 'กลุ่มเติบโตไว', desc: 'เพิ่มความน่าเชื่อถือให้กลุ่มธุรกิจ' },
      { icon: '⚡', title: 'เชื่อมต่อง่ายดาย', desc: 'เริ่มทำงานทันทีเมื่อเริ่มสตรีมไลฟ์' }
    ]
  },
  {
    id: '05_instagram_followers',
    platform: 'INSTAGRAM',
    platformBadge: '🟣 INSTAGRAM ELITE SERVICES',
    title: 'บริการเพิ่มผู้ติดตาม INSTAGRAM (IG FOLLOWER)',
    subtitle: 'เปลี่ยนโปรไฟล์ธรรมดาให้กลายเป็นอินฟลูเอนเซอร์ ปั้นยอดฟอลเสริมภาพลักษณ์สุดปัง',
    theme: {
      accent: '#E1306C',
      accentGlow: 'rgba(225, 48, 108, 0.35)',
      gradient: 'linear-gradient(135deg, #200D1C 0%, #0C0612 100%)',
      badgeBg: 'rgba(225, 48, 108, 0.15)',
      badgeBorder: 'rgba(225, 48, 108, 0.4)'
    },
    col1: {
      name: '🇹🇭 ฟอลคนไทยแท้ (มีโปรไฟล์ มีสตอรี่)',
      desc: 'บัญชีคนไทย 100% ตอบโจทย์ธุรกิจ ร้านค้า และอินฟลูเอนเซอร์ในไทย',
      costPer1k: 1750,
      tiers: [
        { qty: '1,000 ฟอล', price: '7,900', badge: 'เริ่มต้น' },
        { qty: '2,000 ฟอล', price: '14,000', badge: 'ประหยัด 11%' },
        { qty: '5,000 ฟอล', price: '31,500', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ฟอล', price: '57,500', badge: 'ประหยัด 27%' },
        { qty: '20,000 ฟอล', price: '105,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '🌍 ฟอลต่างชาติ พรีเมียม (มีรับประกัน 60 วัน)',
      desc: 'ยอดขึ้นไวทันใจ ไม่ตกหล่น เสริมความอินเตอร์ให้หน้าไอจีดูมีผู้ติดตามนับแสน',
      costPer1k: 140,
      tiers: [
        { qty: '1,000 ฟอล', price: '630', badge: 'เริ่มต้น' },
        { qty: '2,000 ฟอล', price: '1,120', badge: 'ประหยัด 11%' },
        { qty: '5,000 ฟอล', price: '2,500', badge: '🔥 ยอดนิยม (เซฟ 21%)' },
        { qty: '10,000 ฟอล', price: '4,600', badge: 'ประหยัด 27%' },
        { qty: '20,000 ฟอล', price: '8,400', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    features: [
      { icon: '✨', title: 'โปรไฟล์ดูหรูหรา', desc: 'เพิ่มความน่าเชื่อถือให้กับร้านค้า IG' },
      { icon: '♻️', title: 'ประกันเติมนาน 60 วัน', desc: 'ระบบตรวจสอบยอดและเติมฟรีอัตโนมัติ' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ใช้เพียง Username IG ไม่ต้องให้รหัสผ่าน' },
      { icon: '⚡', title: 'ระบบรวดเร็ว', desc: 'เริ่มทยอยส่งยอดใน 0-12 ชั่วโมง' }
    ]
  },
  {
    id: '06_instagram_likes',
    platform: 'INSTAGRAM',
    platformBadge: '🟣 INSTAGRAM ENGAGEMENT',
    title: 'บริการปั๊มไลค์รูป & วิดีโอ INSTAGRAM',
    subtitle: 'ยอดไลค์ขึ้นไว ดันภาพขึ้นหน้า Explore กระตุ้นอัลกอริทึมให้คนค้นพบมากยิ่งขึ้น',
    theme: {
      accent: '#FD1D1D',
      accentGlow: 'rgba(253, 29, 29, 0.35)',
      gradient: 'linear-gradient(135deg, #240C15 0%, #0F050A 100%)',
      badgeBg: 'rgba(253, 29, 29, 0.15)',
      badgeBorder: 'rgba(253, 29, 29, 0.4)'
    },
    col1: {
      name: '🇹🇭 ไลค์คนไทยแท้ (เลือก ชาย / หญิง ได้)',
      desc: 'บัญชีไทยคุณภาพ เหมาะกับสินค้านางแบบ แฟชั่น คลินิก หรือร้านค้าเฉพาะกลุ่ม',
      costPer1k: 1150,
      tiers: [
        { qty: '1,000 ไลก์', price: '5,200', badge: 'เริ่มต้น' },
        { qty: '2,000 ไลก์', price: '9,200', badge: 'ประหยัด 12%' },
        { qty: '5,000 ไลก์', price: '20,700', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ไลก์', price: '38,000', badge: 'ประหยัด 27%' },
        { qty: '20,000 ไลก์', price: '69,000', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    col2: {
      name: '🌍 ไลค์ต่างชาติ ซุปเปอร์ฟาสต์ (เริ่มใน 1 ชม.)',
      desc: 'เน้นความรวดเร็ว ได้ตัวเลขตามเป้า เสริมความปังให้ทุกรูปภาพในราคาเบาๆ',
      costPer1k: 58,
      tiers: [
        { qty: '1,000 ไลก์', price: '290', badge: 'เริ่มต้น' },
        { qty: '2,000 ไลก์', price: '520', badge: 'ประหยัด 10%' },
        { qty: '5,000 ไลก์', price: '1,150', badge: '🔥 ยอดนิยม (เซฟ 21%' },
        { qty: '10,000 ไลก์', price: '2,100', badge: 'ประหยัด 28%' },
        { qty: '20,000 ไลก์', price: '3,800', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    features: [
      { icon: '👫', title: 'แยกเพศได้แม่นยำ', desc: 'ระบุผู้ชาย 👨🏻 หรือผู้หญิง 👩🏻 ได้ตามกลุ่มเป้าหมาย' },
      { icon: '🚀', title: 'ดันหน้าสำรวจ (Explore)', desc: 'ช่วยเพิ่มโอกาสที่โพสต์จะถูกแนะนำ' },
      { icon: '⚡', title: 'ส่งงานทันที', desc: 'เริ่มรันงานภายใน 1 ชั่วโมง' },
      { icon: '🔒', title: 'ไม่กระทบความปลอดภัย', desc: 'ไร้รหัสผ่าน ไม่เสี่ยงต่อการโดนระงับ' }
    ]
  },
  {
    id: '07_instagram_reels_reach',
    platform: 'INSTAGRAM',
    platformBadge: '🟣 INSTAGRAM VIRAL & REELS',
    title: 'บริการวิวคลิป REELS & ดันการมองเห็น IG',
    subtitle: 'เพิ่มยอดวิวคลิปสั้น ดันยอด Impressions, Reach, Saves ช่วยให้อัลกอริทึมรักโพสต์คุณ',
    theme: {
      accent: '#C13584',
      accentGlow: 'rgba(193, 53, 132, 0.35)',
      gradient: 'linear-gradient(135deg, #1C0C1F 0%, #0A050D 100%)',
      badgeBg: 'rgba(193, 53, 132, 0.15)',
      badgeBorder: 'rgba(193, 53, 132, 0.4)'
    },
    col1: {
      name: '🎬 ยอดวิวคลิป IG Reels & Video',
      desc: 'เพิ่มวิวให้ทะลุหมื่น ดันคลิปติดหน้า Reels อัตราการเข้าชมสูงเสถียร',
      costPer1k: 20,
      tiers: [
        { qty: '5,000 วิว', price: '450', badge: 'เริ่มต้น' },
        { qty: '10,000 วิว', price: '800', badge: 'ประหยัด 11%' },
        { qty: '20,000 วิว', price: '1,450', badge: '🔥 ยอดนิยม (เซฟ 19%)' },
        { qty: '50,000 วิว', price: '3,300', badge: 'ประหยัด 27%' },
        { qty: '100,000 วิว', price: '6,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '📈 เซ็ตดันการมองเห็น (Reach + Saves + Share)',
      desc: 'กระตุ้นค่าสถิติหลังบ้าน โพสต์มีคนบันทึกและแชร์ ดันคะแนน Engagement สูงสุด',
      costPer1k: 45,
      tiers: [
        { qty: '1,000 ชุด', price: '250', badge: 'เริ่มต้น' },
        { qty: '2,000 ชุด', price: '450', badge: 'ประหยัด 10%' },
        { qty: '5,000 ชุด', price: '1,000', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ชุด', price: '1,800', badge: 'ประหยัด 28%' },
        { qty: '20,000 ชุด', price: '3,200', badge: '👑 คุ้มสุด (เซฟ 36%)' }
      ]
    },
    features: [
      { icon: '📊', title: 'สถิติหลังบ้านพุ่ง', desc: 'เพิ่มคะแนน Insights ทั้ง Reach และ Saves' },
      { icon: '🚀', title: 'เปิดฟีด Reels', desc: 'ส่งสัญญาณให้อัลกอริทึมดันคลิปต่อเนื่อง' },
      { icon: '⚡', title: 'รวดเร็วเป็นธรรมชาติ', desc: 'ยอดทยอยขึ้นสม่ำเสมอ ไม่กระชาก' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ส่งตรงผ่านระบบเซิร์ฟเวอร์ความเร็วสูง' }
    ]
  },
  {
    id: '08_tiktok_followers_likes',
    platform: 'TIKTOK',
    platformBadge: '⚫ TIKTOK GROWTH VIRAL',
    title: 'บริการผู้ติดตาม & ปั๊มหัวใจ TIKTOK',
    subtitle: 'ปลดล็อกสิทธิ์เปิดตะกร้า TikTok Shop และไลฟ์สด เพิ่มความน่าเชื่อถือให้ช่องเติบโตไว',
    theme: {
      accent: '#00F2FE',
      accentGlow: 'rgba(0, 242, 254, 0.35)',
      gradient: 'linear-gradient(135deg, #091920 0%, #050A0E 100%)',
      badgeBg: 'rgba(0, 242, 254, 0.15)',
      badgeBorder: 'rgba(0, 242, 254, 0.4)'
    },
    col1: {
      name: '🇹🇭 ผู้ติดตาม TikTok คนไทยแท้ (ยอดไม่ลด)',
      desc: 'คนไทยแท้ช่วยเสริมฐานผู้ติดตาม เปิดระบบ Live และ TikTok Seller ได้อย่างมั่นใจ',
      costPer1k: 2500,
      tiers: [
        { qty: '1,000 ฟอล', price: '11,250', badge: 'เริ่มต้น' },
        { qty: '2,000 ฟอล', price: '20,000', badge: 'ประหยัด 11%' },
        { qty: '5,000 ฟอล', price: '45,000', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 ฟอล', price: '82,500', badge: 'ประหยัด 27%' },
        { qty: '20,000 ฟอล', price: '150,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '❤️ ปั๊มหัวใจคลิป TikTok (ดันขึ้นฟีด For You)',
      desc: 'หัวใจคลิปคุณภาพสูง ดันคลิปขึ้นหน้า For You Page (FYP) เพื่อดึงดูดคนดูออร์แกนิก',
      costPer1k: 85,
      tiers: [
        { qty: '1,000 หัวใจ', price: '390', badge: 'เริ่มต้น' },
        { qty: '2,000 หัวใจ', price: '680', badge: 'ประหยัด 13%' },
        { qty: '5,000 หัวใจ', price: '1,550', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 หัวใจ', price: '2,850', badge: 'ประหยัด 27%' },
        { qty: '20,000 หัวใจ', price: '5,100', badge: '👑 คุ้มสุด (เซฟ 35%)' }
      ]
    },
    features: [
      { icon: '🛒', title: 'เปิด TikTok Shop', desc: 'ครบ 1,000 ฟอล เพื่อเปิดร้านค้า & นายหน้า' },
      { icon: '🔴', title: 'ปลดล็อกไลฟ์สด', desc: 'เริ่มสตรีมและไลฟ์ขายของได้ทันที' },
      { icon: '🔥', title: 'ดันหน้า For You (FYP)', desc: 'เพิ่มสถิติส่งผลต่อการเข้าถึงคลิป' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ใช้แค่ชื่อผู้ใช้ TikTok (@username)' }
    ]
  },
  {
    id: '09_tiktok_views_shares',
    platform: 'TIKTOK',
    platformBadge: '⚫ TIKTOK VIRAL BOOST',
    title: 'บริการยอดวิวคลิป & ยอดแชร์ TIKTOK',
    subtitle: 'เสกยอดวิวหลักล้าน ปลุกกระแสคลิปให้กลายเป็นไวรัล ดึงดูดสปอนเซอร์และลูกค้าใหม่',
    theme: {
      accent: '#FE2C55',
      accentGlow: 'rgba(254, 44, 85, 0.35)',
      gradient: 'linear-gradient(135deg, #220A13 0%, #0C0407 100%)',
      badgeBg: 'rgba(254, 44, 85, 0.15)',
      badgeBorder: 'rgba(254, 44, 85, 0.4)'
    },
    col1: {
      name: '👀 เพิ่มยอดวิวคลิป TikTok ไวรัล (เริ่มทันที)',
      desc: 'เซิร์ฟเวอร์ความเร็วสูง ทยอยส่งวิวทันใจ เหมาะสำหรับทั้งคลิปโปรโมทและคลิปทั่วไป',
      costPer1k: 8,
      tiers: [
        { qty: '5,000 วิว', price: '180', badge: 'เริ่มต้น' },
        { qty: '10,000 วิว', price: '320', badge: 'ประหยัด 11%' },
        { qty: '20,000 วิว', price: '580', badge: '🔥 ยอดนิยม (เซฟ 19%)' },
        { qty: '50,000 วิว', price: '1,350', badge: 'ประหยัด 25%' },
        { qty: '100,000 วิว', price: '2,400', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '🔄 เพิ่มยอดแชร์คลิป TikTok (Boost Algorithm)',
      desc: 'การแชร์คือสัญญาณสำคัญที่สุดที่ทำให้อัลกอริทึม TikTok ปล่อยให้คนดูเห็นเพิ่มขึ้น',
      costPer1k: 32,
      tiers: [
        { qty: '1,000 แชร์', price: '220', badge: 'เริ่มต้น' },
        { qty: '2,000 แชร์', price: '390', badge: 'ประหยัด 11%' },
        { qty: '5,000 แชร์', price: '860', badge: '🔥 ยอดนิยม (เซฟ 22%)' },
        { qty: '10,000 แชร์', price: '1,600', badge: 'ประหยัด 27%' },
        { qty: '20,000 แชร์', price: '2,900', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    features: [
      { icon: '🚀', title: 'ไวรัลไวในพริบตา', desc: 'คลิปดูน่าสนใจจนคนต้องหยุดดู' },
      { icon: '⚡', title: 'เริ่มงานทันที', desc: 'ระบบอัตโนมัติส่งยอดทันใจใน 1-5 ชม.' },
      { icon: '📊', title: 'สถิติครบวงจร', desc: 'ทั้งยอดวิวและแชร์ส่งเสริมซึ่งกันและกัน' },
      { icon: '🔒', title: 'ปลอดภัย ไร้รหัสผ่าน', desc: 'ใช้เพียงลิงก์คลิปวิดีโอเท่านั้น' }
    ]
  },
  {
    id: '10_twitter_x_all',
    platform: 'X (TWITTER)',
    platformBadge: '🌐 X (TWITTER) TREND SERVICES',
    title: 'บริการผู้ติดตาม, รีทวิต (RETWEET) & ไลค์ X',
    subtitle: 'ปั่นกระแส ติดเทรนด์ X กระจายข่าวสารและดันคอนเทนต์ให้เป็นที่พูดถึงในวงกว้าง',
    theme: {
      accent: '#1DA1F2',
      accentGlow: 'rgba(29, 161, 242, 0.35)',
      gradient: 'linear-gradient(135deg, #091824 0%, #050B10 100%)',
      badgeBg: 'rgba(29, 161, 242, 0.15)',
      badgeBorder: 'rgba(29, 161, 242, 0.4)'
    },
    col1: {
      name: '🇹🇭 ผู้ติดตาม / รีทวิต คนไทยแท้ 100%',
      desc: 'บัญชีคนไทยใช้งานจริง เหมาะกับการโปรโมตศิลปิน แบรนด์ หรือดราม่าติดเทรนด์ไทย',
      costPer1k: 2500,
      tiers: [
        { qty: '100 แอคชั่น', price: '1,150', badge: 'เริ่มต้น' },
        { qty: '200 แอคชั่น', price: '2,000', badge: 'ประหยัด 13%' },
        { qty: '500 แอคชั่น', price: '4,500', badge: '🔥 ยอดนิยม (เซฟ 22%)' },
        { qty: '1,000 แอคชั่น', price: '8,250', badge: 'ประหยัด 28%' },
        { qty: '2,000 แอคชั่น', price: '15,000', badge: '👑 คุ้มสุด (เซฟ 35%)' }
      ]
    },
    col2: {
      name: '🌍 รีทวิต & ปั๊มไลค์โพสต์ ต่างชาติ (ปั่นยอด)',
      desc: 'ยอดขึ้นรวดเร็ว กระจายโพสต์ให้ดูมียอดรีทวิตหลักพัน-หลักหมื่น สร้างความฮือฮา',
      costPer1k: 300,
      tiers: [
        { qty: '500 รีทวิต/ไลก์', price: '680', badge: 'เริ่มต้น' },
        { qty: '1,000 รีทวิต/ไลก์', price: '1,200', badge: 'ประหยัด 12%' },
        { qty: '2,000 รีทวิต/ไลก์', price: '2,150', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '5,000 รีทวิต/ไลก์', price: '4,950', badge: 'ประหยัด 27%' },
        { qty: '10,000 รีทวิต/ไลก์', price: '9,000', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    features: [
      { icon: '🔥', title: 'ดันติดแฮชแท็กเทรนด์', desc: 'เพิ่มอัตราการพูดถึงและส่งต่อ' },
      { icon: '⚡', title: 'เริ่มไวใน 0-3 ชม.', desc: 'ระบบทำงานรวดเร็วตามกระแสแบบเรียลไทม์' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ไม่เสี่ยงบัญชีโดนแบน ไร้รหัสผ่าน' },
      { icon: '📈', title: 'สร้างกระแสทรงพลัง', desc: 'เพิ่มความน่าเชื่อถือของข่าวสารและแคมเปญ' }
    ]
  },
  {
    id: '11_youtube_views_hours',
    platform: 'YOUTUBE',
    platformBadge: '🔴 YOUTUBE PARTNER GROWTH',
    title: 'บริการวิวยูทูป, ไลค์ & 4,000 ชั่วโมงรับชม',
    subtitle: 'ดันคลิปติดหน้าแนะนำ ปลดล็อกกฎเกณฑ์สร้างรายได้ YouTube Partner อย่างรวดเร็ว',
    theme: {
      accent: '#FF0000',
      accentGlow: 'rgba(255, 0, 0, 0.35)',
      gradient: 'linear-gradient(135deg, #240A0A 0%, #0D0404 100%)',
      badgeBg: 'rgba(255, 0, 0, 0.15)',
      badgeBorder: 'rgba(255, 0, 0, 0.4)'
    },
    col1: {
      name: '▶️ เพิ่มยอดวิวยูทูปแท้ (มีประกัน 90 วัน)',
      desc: 'ยอดวิวคุณภาพสูง ดูเป็นธรรมชาติ อัตรา Retension ดีเยี่ยม ดันคลิปติดฟีดแนะนำ',
      costPer1k: 160,
      tiers: [
        { qty: '1,000 วิว', price: '720', badge: 'เริ่มต้น' },
        { qty: '2,000 วิว', price: '1,280', badge: 'ประหยัด 11%' },
        { qty: '5,000 วิว', price: '2,880', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '10,000 วิว', price: '5,280', badge: 'ประหยัด 27%' },
        { qty: '20,000 วิว', price: '9,600', badge: '👑 คุ้มสุด (เซฟ 33%)' }
      ]
    },
    col2: {
      name: '⏱️ เพิ่มชั่วโมงการรับชม (Monetization Hours)',
      desc: 'สำหรับยูทูบเบอร์ที่ต้องการเปิดสร้างรายได้ ครบเงื่อนไข 4,000 ชั่วโมง ไวทันใจ',
      costPer1k: 650,
      tiers: [
        { qty: '500 ชั่วโมง', price: '1,450', badge: 'เริ่มต้น' },
        { qty: '1,000 ชั่วโมง', price: '2,600', badge: 'ประหยัด 10%' },
        { qty: '2,000 ชั่วโมง', price: '4,700', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '3,000 ชั่วโมง', price: '6,450', badge: 'ประหยัด 27%' },
        { qty: '4,000 ชม. (ครบสูตร)', price: '7,800', badge: '👑 สำเร็จทันที (เซฟ 35%)' }
      ]
    },
    features: [
      { icon: '💰', title: 'เปิดสร้างรายได้', desc: 'ช่วยให้ผ่านกฎ YouTube Partner ได้ไว' },
      { icon: '♻️', title: 'ประกัน 90 วันเต็ม', desc: 'หากยอดวิวลด เติมฟรีทันที' },
      { icon: '📺', title: 'รองรับคลิปยาว & สั้น', desc: 'ใช้ได้ทั้งวิดีโอยาว และ YouTube Shorts' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ใช้เพียงลิงก์วิดีโอคลิปเท่านั้น' }
    ]
  },
  {
    id: '12_line_oa_openchat',
    platform: 'LINE',
    platformBadge: '🟢 LINE MARKETING SERVICES',
    title: 'บริการเพิ่มเพื่อน LINE OA & OPENCHAT',
    subtitle: 'ขยายฐานลูกค้าบน LINE เพิ่มทาร์เกตรีช ปิดการขายง่ายขึ้น สร้างยอดขายปังทุกวัน',
    theme: {
      accent: '#06C755',
      accentGlow: 'rgba(6, 199, 85, 0.35)',
      gradient: 'linear-gradient(135deg, #091F12 0%, #040E08 100%)',
      badgeBg: 'rgba(6, 199, 85, 0.15)',
      badgeBorder: 'rgba(6, 199, 85, 0.4)'
    },
    col1: {
      name: '🇹🇭 เพิ่มเพื่อน Line Official Account (คนไทย)',
      desc: 'เพิ่มจำนวน Follower ให้ Line OA ของคุณ ดูเป็นธุรกิจใหญ่ น่าเชื่อถือ ปิดการขายไว',
      costPer1k: 1800,
      tiers: [
        { qty: '100 เพื่อน', price: '900', badge: 'เริ่มต้น' },
        { qty: '200 เพื่อน', price: '1,620', badge: 'ประหยัด 10%' },
        { qty: '500 เพื่อน', price: '3,600', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '1,000 เพื่อน', price: '6,300', badge: 'ประหยัด 30%' },
        { qty: '2,000 เพื่อน', price: '10,800', badge: '👑 คุ้มสุด (เซฟ 40%)' }
      ]
    },
    col2: {
      name: '💬 เพิ่มสมาชิกกลุ่ม Line OpenChat คนไทยแท้',
      desc: 'สร้างกลุ่มสังคมที่มีสมาชิกคึกคัก เหมาะกับกลุ่มลงทุน กลุ่มแฟนคลับ หรือแวดวงธุรกิจ',
      costPer1k: 5000,
      tiers: [
        { qty: '50 สมาชิก', price: '1,250', badge: 'เริ่มต้น' },
        { qty: '100 สมาชิก', price: '2,250', badge: 'ประหยัด 10%' },
        { qty: '200 สมาชิก', price: '4,000', badge: '🔥 ยอดนิยม (เซฟ 20%)' },
        { qty: '300 สมาชิก', price: '5,400', badge: 'ประหยัด 28%' },
        { qty: '500 สมาชิก', price: '8,250', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    features: [
      { icon: '💼', title: 'เหมาะกับธุรกิจ', desc: 'เพิ่มความน่าเชื่อถือให้แบรนด์บน LINE' },
      { icon: '🎯', title: 'ทาร์เกตรีชสูง', desc: 'ช่วยเพิ่มคะแนนความน่าเชื่อถือของบัญชี' },
      { icon: '⚡', title: 'ทำงานปลอดภัย', desc: 'ส่งตรงผ่านลิงก์ ไม่กระทบข้อมูลบัญชี' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ใช้เพียงลิงก์เชิญ หรือ @LineID เท่านั้น' }
    ]
  },
  {
    id: '13_website_traffic',
    platform: 'WEBSITE TRAFFIC',
    platformBadge: '🌐 GOOGLE & SOCIAL TRAFFIC',
    title: 'บริการเพิ่มยอดเข้าชมเว็บไซต์ (WEB TRAFFIC)',
    subtitle: 'ดันอันดับ Google SEO เพิ่มยอดผู้เข้าชมจาก Search Engine และ Social Media ชั้นนำ',
    theme: {
      accent: '#8B5CF6',
      accentGlow: 'rgba(139, 92, 246, 0.35)',
      gradient: 'linear-gradient(135deg, #180D2B 0%, #0A0514 100%)',
      badgeBg: 'rgba(139, 92, 246, 0.15)',
      badgeBorder: 'rgba(139, 92, 246, 0.4)'
    },
    col1: {
      name: '🔍 Traffic จาก Google Search (Organic SEO)',
      desc: 'คนเข้าชมผ่านผลการค้นหา Google ช่วยดันอันดับเว็บไซต์ให้ติดหน้าแรก SEO',
      costPer1k: 95,
      tiers: [
        { qty: '5,000 ครั้ง', price: '2,150', badge: 'เริ่มต้น' },
        { qty: '10,000 ครั้ง', price: '3,800', badge: 'ประหยัด 12%' },
        { qty: '20,000 ครั้ง', price: '6,800', badge: '🔥 ยอดนิยม (เซฟ 21%)' },
        { qty: '50,000 ครั้ง', price: '15,500', badge: 'ประหยัด 28%' },
        { qty: '100,000 ครั้ง', price: '28,500', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    col2: {
      name: '📲 Traffic จาก Social (FB / IG / Pantip / Shopee)',
      desc: 'ทราฟฟิกส่งตรงจากแหล่งโซเชียลยอดฮิต เพิ่มคะแนนความน่าเชื่อถือและยอดวิวหน้าเว็บ',
      costPer1k: 95,
      tiers: [
        { qty: '5,000 ครั้ง', price: '2,150', badge: 'เริ่มต้น' },
        { qty: '10,000 ครั้ง', price: '3,800', badge: 'ประหยัด 12%' },
        { qty: '20,000 ครั้ง', price: '6,800', badge: '🔥 ยอดนิยม (เซฟ 21%)' },
        { qty: '50,000 ครั้ง', price: '15,500', badge: 'ประหยัด 28%' },
        { qty: '100,000 ครั้ง', price: '28,500', badge: '👑 คุ้มสุด (เซฟ 34%)' }
      ]
    },
    features: [
      { icon: '📈', title: 'ดันอันดับ Google SEO', desc: 'เพิ่มคะแนน CTR และยอดวิวหน้าเว็บไซต์' },
      { icon: '🌍', title: 'วัดผลได้บน Analytics', desc: 'ยอดเข้าชมแสดงบน Google Analytics ชัดเจน' },
      { icon: '⏱️', title: 'มีระยะเวลาอยู่ในเว็บ', desc: 'ไม่ใช่บอทเปล่าๆ อยู่ในเว็บอย่างเป็นธรรมชาติ' },
      { icon: '🔒', title: 'ปลอดภัย 100%', desc: 'ใช้เพียง URL เว็บไซต์ปลายทางเท่านั้น' }
    ]
  },
  {
    id: '14_all_in_one_master',
    platform: 'ALL-IN-ONE MASTER',
    platformBadge: '👑 ALL PLATFORMS MEGA RATE CARD',
    title: 'สรุปเรทการ์ดบริการยอดฮิต ทุกแพลตฟอร์ม',
    subtitle: 'รวบรวมแพ็กเกจขายดีอันดับ 1 ของ NSPanelTHAI ครบ จบ ทุกโซเชียลมีเดียในใบเดียว',
    theme: {
      accent: '#FFB800',
      accentGlow: 'rgba(255, 184, 0, 0.35)',
      gradient: 'linear-gradient(135deg, #22190A 0%, #0E0A04 100%)',
      badgeBg: 'rgba(255, 184, 0, 0.15)',
      badgeBorder: 'rgba(255, 184, 0, 0.4)'
    },
    isGrid: true,
    servicesList: [
      {
        platform: 'FACEBOOK',
        icon: '🔵',
        name: 'ไลค์โพสต์ & รูปภาพ',
        priceStart: '฿ 390',
        bulkPrice: '฿ 5,100 / 20k',
        tag: 'ขายดี #1'
      },
      {
        platform: 'FACEBOOK',
        icon: '🔵',
        name: 'ผู้ติดตามเพจ/โปรไฟล์',
        priceStart: '฿ 890',
        bulkPrice: '฿ 11,700 / 20k',
        tag: 'ประกัน 30 วัน'
      },
      {
        platform: 'INSTAGRAM',
        icon: '🟣',
        name: 'ผู้ติดตาม IG แท้',
        priceStart: '฿ 630',
        bulkPrice: '฿ 8,400 / 20k',
        tag: 'ยอดไม่ลด'
      },
      {
        platform: 'INSTAGRAM',
        icon: '🟣',
        name: 'ไลค์รูป IG (แยกเพศได้)',
        priceStart: '฿ 290',
        bulkPrice: '฿ 3,800 / 20k',
        tag: 'ขึ้นไว 1 ชม.'
      },
      {
        platform: 'TIKTOK',
        icon: '⚫',
        name: 'ฟอลโลเวอร์ TikTok',
        priceStart: '฿ 11,250',
        bulkPrice: 'เปิดตะกร้าได้',
        tag: 'คนไทย 100%'
      },
      {
        platform: 'TIKTOK',
        icon: '⚫',
        name: 'ยอดวิวคลิป TikTok',
        priceStart: '฿ 180 / 5k',
        bulkPrice: '฿ 2,400 / 100k',
        tag: 'ดันขึ้น FYP'
      },
      {
        platform: 'X (TWITTER)',
        icon: '🌐',
        name: 'รีทวิต & ไลค์ทวีต',
        priceStart: '฿ 680',
        bulkPrice: '฿ 9,000 / 10k',
        tag: 'ปั่นแฮชแท็ก'
      },
      {
        platform: 'YOUTUBE',
        icon: '🔴',
        name: 'ยอดวิว & 4,000 ชม.',
        priceStart: '฿ 720',
        bulkPrice: 'เปิดสร้างรายได้',
        tag: 'ประกัน 90 วัน'
      },
      {
        platform: 'LINE OA',
        icon: '🟢',
        name: 'เพิ่มเพื่อน Line OA',
        priceStart: '฿ 900 / 100',
        bulkPrice: '฿ 10,800 / 2k',
        tag: 'เพิ่มยอดขาย'
      }
    ],
    features: [
      { icon: '🚀', title: 'ระบบออโต้ 24 ชม.', desc: 'ทำรายการได้ตลอดเวลา ไม่มีวันหยุด' },
      { icon: '🛡️', title: 'รับประกันยอดลด', desc: 'มีบริการรีฟิลเติมให้ฟรีทุกรายการ' },
      { icon: '🔒', title: 'ปลอดภัยสูงสุด', desc: 'ไม่ใช้รหัสผ่าน รักษาความเป็นส่วนตัว' },
      { icon: '👑', title: 'เรทตัวแทนคุ้มค่า', desc: 'ยิ่งซื้อจำนวนเยอะ ยิ่งประหยัดสูงสุด 35%' }
    ]
  }
];

function generateHTML(card) {
  const t = card.theme;

  let centerContent = '';

  if (!card.isGrid) {
    centerContent = `
      <div class="pricing-container">
        <!-- Column 1 -->
        <div class="pricing-card">
          <div class="card-header col1-header">
            <div class="col-title">${card.col1.name}</div>
            <div class="col-desc">${card.col1.desc}</div>
          </div>
          <div class="tier-list">
            ${card.col1.tiers.map((tier, idx) => `
              <div class="tier-row ${idx === 2 ? 'featured' : ''}">
                <div class="tier-left">
                  <span class="qty-text">${tier.qty}</span>
                </div>
                <div class="tier-right">
                  <span class="price-val"><small>฿</small>${tier.price}</span>
                  <span class="badge-pill ${idx === 2 ? 'badge-hot' : (idx === 4 ? 'badge-vip' : '')}">${tier.badge}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Column 2 -->
        <div class="pricing-card">
          <div class="card-header col2-header">
            <div class="col-title">${card.col2.name}</div>
            <div class="col-desc">${card.col2.desc}</div>
          </div>
          <div class="tier-list">
            ${card.col2.tiers.map((tier, idx) => `
              <div class="tier-row ${idx === 2 ? 'featured' : ''}">
                <div class="tier-left">
                  <span class="qty-text">${tier.qty}</span>
                </div>
                <div class="tier-right">
                  <span class="price-val"><small>฿</small>${tier.price}</span>
                  <span class="badge-pill ${idx === 2 ? 'badge-hot' : (idx === 4 ? 'badge-vip' : '')}">${tier.badge}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  } else {
    // Mega Grid
    centerContent = `
      <div class="mega-grid">
        ${card.servicesList.map(item => `
          <div class="mega-card">
            <div class="mega-top">
              <span class="mega-icon">${item.icon}</span>
              <span class="mega-platform">${item.platform}</span>
              <span class="mega-tag">${item.tag}</span>
            </div>
            <div class="mega-name">${item.name}</div>
            <div class="mega-bottom">
              <div class="mega-start"><small>เริ่มต้น</small> <span>${item.priceStart}</span></div>
              <div class="mega-bulk">${item.bulkPrice}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  return `<!DOCTYPE html>
<html lang="th">
<head>
  <meta charset="UTF-8">
  <title>${card.title} - NSPanelTHAI</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kanit:wght@300;400;500;600;700;800;900&family=Prompt:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1080px;
      height: 1080px;
      background: ${t.gradient};
      font-family: 'Prompt', 'Kanit', sans-serif;
      color: #FFFFFF;
      overflow: hidden;
      position: relative;
    }

    /* Ambient background glows */
    .bg-glow-top {
      position: absolute;
      top: -120px;
      left: 50%;
      transform: translateX(-50%);
      width: 800px;
      height: 380px;
      background: radial-gradient(circle, ${t.accentGlow} 0%, rgba(0,0,0,0) 70%);
      pointer-events: none;
      z-index: 1;
    }
    .bg-glow-bottom {
      position: absolute;
      bottom: -150px;
      right: -100px;
      width: 600px;
      height: 400px;
      background: radial-gradient(circle, ${t.accentGlow} 0%, rgba(0,0,0,0) 75%);
      pointer-events: none;
      z-index: 1;
    }
    .grid-lines {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 40px 40px;
      pointer-events: none;
      z-index: 2;
    }

    /* Main Container */
    .main-wrapper {
      position: relative;
      z-index: 10;
      width: 1080px;
      height: 1080px;
      padding: 44px 44px 38px 44px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Top Bar */
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    .brand-badge {
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.12);
      padding: 8px 18px;
      border-radius: 100px;
      backdrop-filter: blur(10px);
    }
    .brand-icon {
      font-size: 20px;
    }
    .brand-name {
      font-family: 'Kanit', sans-serif;
      font-size: 20px;
      font-weight: 800;
      letter-spacing: 0.5px;
      background: linear-gradient(90deg, #FFFFFF, #B0C4DE);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .brand-sub {
      font-size: 11px;
      color: ${t.accent};
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .top-tag {
      font-size: 13px;
      font-weight: 600;
      color: #A0AEC0;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 8px 16px;
      border-radius: 100px;
    }

    /* Header */
    .header-section {
      text-align: center;
      margin-bottom: 22px;
    }
    .platform-badge {
      display: inline-block;
      font-family: 'Kanit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: ${t.accent};
      background: ${t.badgeBg};
      border: 1px solid ${t.badgeBorder};
      padding: 5px 16px;
      border-radius: 50px;
      margin-bottom: 10px;
      text-transform: uppercase;
      box-shadow: 0 0 16px ${t.accentGlow};
    }
    .main-title {
      font-family: 'Kanit', sans-serif;
      font-size: 38px;
      font-weight: 900;
      color: #FFFFFF;
      line-height: 1.15;
      letter-spacing: -0.5px;
      margin-bottom: 8px;
      text-shadow: 0 4px 16px rgba(0, 0, 0, 0.6);
    }
    .sub-title {
      font-size: 15px;
      font-weight: 400;
      color: #94A3B8;
      max-width: 820px;
      margin: 0 auto;
      line-height: 1.4;
    }

    /* Pricing Container (2 Columns) */
    .pricing-container {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 18px;
    }
    .pricing-card {
      background: rgba(18, 24, 38, 0.75);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      padding: 18px 20px;
      backdrop-filter: blur(12px);
      box-shadow: 0 16px 36px rgba(0, 0, 0, 0.4);
      position: relative;
    }
    .card-header {
      padding-bottom: 12px;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .col-title {
      font-family: 'Kanit', sans-serif;
      font-size: 17px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .col-desc {
      font-size: 11px;
      color: #718096;
      line-height: 1.35;
    }
    .tier-list {
      display: flex;
      flex-direction: column;
      gap: 9px;
    }
    .tier-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 12px;
      padding: 10px 14px;
      transition: all 0.2s ease;
    }
    .tier-row.featured {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.03) 100%);
      border-color: ${t.accent};
      box-shadow: 0 0 12px ${t.accentGlow};
    }
    .tier-left {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .qty-text {
      font-family: 'Kanit', sans-serif;
      font-size: 17px;
      font-weight: 600;
      color: #E2E8F0;
    }
    .tier-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .price-val {
      font-family: 'Kanit', sans-serif;
      font-size: 21px;
      font-weight: 800;
      color: #FFDF00;
      letter-spacing: -0.5px;
    }
    .price-val small {
      font-size: 13px;
      font-weight: 600;
      margin-right: 2px;
      color: #F6E05E;
    }
    .badge-pill {
      font-size: 11px;
      font-weight: 600;
      color: #94A3B8;
      background: rgba(255, 255, 255, 0.06);
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      white-space: nowrap;
    }
    .badge-pill.badge-hot {
      color: #FF5A5F;
      background: rgba(255, 90, 95, 0.15);
      border-color: rgba(255, 90, 95, 0.4);
      font-weight: 700;
    }
    .badge-pill.badge-vip {
      color: #38EF7D;
      background: rgba(56, 239, 125, 0.15);
      border-color: rgba(56, 239, 125, 0.4);
      font-weight: 700;
    }

    /* Mega Grid Layout for Master Card */
    .mega-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-bottom: 18px;
    }
    .mega-card {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 16px;
      padding: 16px;
      backdrop-filter: blur(10px);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .mega-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .mega-icon {
      font-size: 18px;
    }
    .mega-platform {
      font-family: 'Kanit', sans-serif;
      font-size: 11px;
      font-weight: 700;
      color: #A0AEC0;
      letter-spacing: 1px;
    }
    .mega-tag {
      font-size: 10px;
      font-weight: 700;
      color: #FFB800;
      background: rgba(255, 184, 0, 0.15);
      padding: 2px 6px;
      border-radius: 4px;
    }
    .mega-name {
      font-family: 'Kanit', sans-serif;
      font-size: 16px;
      font-weight: 700;
      color: #FFFFFF;
      margin-bottom: 12px;
      line-height: 1.2;
    }
    .mega-bottom {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      padding-top: 8px;
    }
    .mega-start small {
      font-size: 10px;
      color: #718096;
    }
    .mega-start span {
      font-family: 'Kanit', sans-serif;
      font-size: 17px;
      font-weight: 800;
      color: #FFDF00;
    }
    .mega-bulk {
      font-size: 11px;
      color: #38EF7D;
      font-weight: 600;
    }

    /* Features Row */
    .features-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin-bottom: 18px;
    }
    .feature-item {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .feat-icon {
      font-size: 20px;
    }
    .feat-title {
      font-family: 'Kanit', sans-serif;
      font-size: 12px;
      font-weight: 700;
      color: #F8FAFC;
    }
    .feat-desc {
      font-size: 10px;
      color: #64748B;
      line-height: 1.2;
    }

    /* Footer */
    .footer-section {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .footer-left {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .footer-headline {
      font-family: 'Kanit', sans-serif;
      font-size: 14px;
      font-weight: 700;
      color: #E2E8F0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .footer-sub {
      font-size: 11px;
      color: #94A3B8;
    }
    .footer-right {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .contact-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: ${t.badgeBg};
      border: 1px solid ${t.badgeBorder};
      padding: 7px 16px;
      border-radius: 50px;
    }
    .contact-text {
      font-family: 'Kanit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      color: #FFFFFF;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-glow-top"></div>
  <div class="bg-glow-bottom"></div>
  <div class="grid-lines"></div>

  <div class="main-wrapper">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="brand-badge">
        <span class="brand-icon">🚀</span>
        <div>
          <div class="brand-name">NSPanelTHAI</div>
        </div>
        <span class="brand-sub">อันดับ 1 ในไทย</span>
      </div>
      <div class="top-tag">
        ⚡ ระบบอัตโนมัติ 24 ชม. • 🔒 ไม่ต้องใช้รหัสผ่าน
      </div>
    </div>

    <!-- Header Section -->
    <div class="header-section">
      <div class="platform-badge">${card.platformBadge}</div>
      <h1 class="main-title">${card.title}</h1>
      <p class="sub-title">${card.subtitle}</p>
    </div>

    <!-- Main Pricing or Grid -->
    ${centerContent}

    <!-- Features Row -->
    <div class="features-row">
      ${card.features.map(f => `
        <div class="feature-item">
          <span class="feat-icon">${f.icon}</span>
          <div>
            <div class="feat-title">${f.title}</div>
            <div class="feat-desc">${f.desc}</div>
          </div>
        </div>
      `).join('')}
    </div>

    <!-- Footer -->
    <div class="footer-section">
      <div class="footer-left">
        <div class="footer-headline">🔥 ยิ่งซื้อแพ็กเกจใหญ่ ยิ่งประหยัดสูงสุดถึง 35%!</div>
        <div class="footer-sub">อัตราค่าบริการเป็นไปตามโปรโมชั่นปัจจุบัน | รับประกันความปลอดภัย 100%</div>
      </div>
      <div class="footer-right">
        <div class="contact-badge">
          <span style="font-size:14px;">🌐</span>
          <span class="contact-text">www.nspanel.com</span>
        </div>
        <div class="contact-badge" style="background: rgba(6, 199, 85, 0.15); border-color: rgba(6, 199, 85, 0.4);">
          <span style="font-size:14px;">💬</span>
          <span class="contact-text" style="color: #06C755;">LINE: @nspanel</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}

async function run() {
  const outputDir = path.join(__dirname);
  console.log('Generating Rate Cards in:', outputDir);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });

  for (let i = 0; i < rateCardsData.length; i++) {
    const card = rateCardsData[i];
    console.log(`[${i + 1}/${rateCardsData.length}] Rendering ${card.id}...`);

    const html = generateHTML(card);
    const htmlPath = path.join(outputDir, `${card.id}.html`);
    const pngPath = path.join(outputDir, `${card.id}.png`);

    fs.writeFileSync(htmlPath, html, 'utf8');

    await page.goto(`file://${htmlPath}`, { waitUntil: 'networkidle0' });
    // Wait for web fonts to load
    await page.evaluateHandle('document.fonts.ready');
    await page.screenshot({ path: pngPath });

    console.log(`  -> Saved: ${card.id}.png`);
  }

  await browser.close();
  console.log('All 14 rate card artworks generated successfully!');
}

run().catch(console.error);
