Süper bir backend çıkarmışsın 👌 şimdi bunun önüne **ürüne yakışır, modern ve ölçeklenebilir bir frontend** koymak için **PRD (Product Requirements Document) – TEMPLATE** hazırlayalım.

> Bu belge **şu an sadece Login & Register dolu**,
> `/app` altındaki dashboard **boş (placeholder)** olacak şekilde tasarlanmıştır.
> Ama ileride SaaS büyüdükçe **hiç kırılmadan genişleyebilir**.

---

# 📄 PRD – Frontend Web Application

**Multi-Tenant SaaS Starter Kit**

## 1. 📌 Doküman Bilgileri

| Alan         | Değer                                                 |
| ------------ | ----------------------------------------------------- |
| Ürün Adı     | Multi-Tenant SaaS Web App                             |
| Doküman Türü | PRD (Template)                                        |
| Versiyon     | v1.0                                                  |
| Durum        | Draft                                                 |
| Backend      | NestJS + Prisma                                       |
| Hedef Kitle  | SaaS geliştiricileri, startup’lar, enterprise ekipler |

---

## 2. 🎯 Ürün Amacı

Bu frontend uygulamasının amacı:

* Kullanıcıların **SaaS platformuna modern ve güvenli bir şekilde giriş yapmasını**
* **Multi-tenant yapıya uygun tenant seçimi** akışını
* Gelecekte eklenecek tüm SaaS modülleri için **sağlam bir UI foundation** sağlamaktır

> Bu aşamada **işlevsel kapsam minimum**,
> **tasarım ve mimari maksimum kaliteli** olacaktır.

---

## 3. 👥 Hedef Kullanıcılar

### 3.1 Primary User

* SaaS ürünü kullanan son kullanıcı
* Birden fazla tenant (company) üyesi olabilir

### 3.2 Secondary User

* SaaS ürününü kurcalayan developer
* Starter kit’i kendi ürününe uyarlamak isteyen ekip

---

## 4. 🧭 Bilgi Mimarisi (Information Architecture)

```text
/
 ├─ Landing Page
 ├─ Login
 ├─ Register
 └─ /app
     ├─ Dashboard (Empty / Placeholder)
```

---

## 5. 🧱 Sayfa Bazlı Gereksinimler

---

## 5.1 🏠 Landing Page (`/`)

### Amaç

* Ürünü **net, güven veren ve modern** şekilde tanıtmak
* Login / Register’a yönlendirmek

### İçerik Blokları

1. **Hero Section**

   * Headline:

     > “Build multi-tenant SaaS products faster”
   * Subheadline:

     > “Production-ready authentication, roles, permissions & tenant isolation”
   * CTA:

     * `Get Started`
     * `Login`

2. **Features Section**

   * Multi-Tenant Architecture
   * Role & Permission System
   * Secure JWT Auth
   * Scalable Backend

3. **Tech Stack Section**

   * NestJS
   * PostgreSQL
   * Redis
   * Prisma

4. **Footer**

   * GitHub link
   * License (MIT)
   * Author info

### Tasarım Notları

* Minimal
* Dark mode destekli
* Büyük tipografi
* Soft gradient arka plan
* Hafif animasyonlar (fade / slide)

---

## 5.2 🔐 Login Page (`/login`)

### Amaç

* Kullanıcıyı authenticate etmek
* Tenant seçimi akışını başlatmak

### Alanlar

* Email
* Password
* Login Button

### Akış

1. Kullanıcı email + password girer
2. Backend → login
3. Response: tenant listesi
4. Tenant seçimi (modal veya ara ekran)
5. Access + Refresh token alınır
6. `/app` yönlendirme

### UX Detayları

* Loading state
* Error state (invalid credentials)
* Disabled button logic
* Password visibility toggle

---

## 5.3 📝 Register Page (`/register`)

### Amaç

* Yeni kullanıcı + ilk tenant oluşturmak

### Alanlar

* Full Name
* Email
* Password
* Company / Tenant Name
* Register Button

### Akış

1. Kullanıcı formu doldurur
2. Backend:

   * User oluşturulur
   * Tenant oluşturulur
   * OWNER rol atanır
3. Otomatik login
4. `/app` yönlendirme

### UX Detayları

* Password strength indicator
* Inline validation
* Success feedback

---

## 5.4 📊 App Dashboard (`/app`)

> **Bu versiyonda içerik YOKTUR (placeholder)**

### Amaç

* Giriş sonrası ana container’ı kurmak
* Gelecek modüller için layout hazırlamak

### İçerik

* Sidebar (boş)
* Topbar (user + tenant info)
* Main Content:

  > “Welcome to your dashboard”

### Not

* Hiçbir business logic yok
* Sadece layout & routing doğrulaması

---

## 6. 🎨 Tasarım & UI Prensipleri

### Genel Stil

* Modern SaaS
* Clean
* Minimal
* Developer-friendly

### Renk Paleti (Örnek)

* Primary: Indigo / Blue
* Background: #0F172A / #FFFFFF
* Accent: Emerald / Cyan
* Error: Red 500

### Typography

* Inter / SF Pro / Geist
* Büyük başlıklar
* Rahat okunur body text

### UI Yaklaşımı

* Card-based layout
* Soft shadows
* Rounded corners
* Micro-interactions

---

## 7. 🧩 Teknik Varsayımlar (Frontend)

> PRD olduğu için **framework bağımsız**, ama modern stack hedeflenir.

* React / Next.js
* TypeScript
* Auth state management
* API layer (Axios / Fetch)
* Token handling (access + refresh)
* Protected routes

---

## 8. 🔐 Güvenlik & Auth Gereksinimleri

* JWT access token → memory
* Refresh token → httpOnly cookie (opsiyonel)
* Protected `/app` routes
* Logout flow

---

## 9. 🚧 Kapsam Dışı (Bu Versiyon İçin)

* Dashboard içeriği
* Project CRUD
* Role management UI
* Billing
* Settings
* Audit logs

---

## 10. 🛣️ Gelecek Iterasyonlar İçin Hazırlık

* Sidebar navigation scalable olmalı
* Role-based UI rendering
* Tenant switcher component
* Feature flags
* Dark / Light theme switch

---

## 11. 📌 Başarı Kriterleri (MVP)

* Kullanıcı register olabilir
* Login olabilir
* Tenant seçip `/app` görebilir
* UI modern ve “enterprise SaaS” hissi verir
