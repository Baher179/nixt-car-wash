# NIXT — Project and Business Guide for Claude

This file is the durable project brief and business reference for redesigning the NIXT website. Read it before planning, coding, or reviewing any change. The project goal is a high-end redesign of the existing customer experience. Preserve the business model and behavior described here unless the owner explicitly authorizes a business change.

## Mandatory change-control rule

**A request to redesign, improve, polish, modernize, animate, refactor, or fix the website does not authorize a change to business behavior.** Keep all existing services, product and package offerings, eligibility, selections, quantities, formulas, prices, discounts, taxes, delivery charges, availability rules, booking steps, payment methods, payment timing, order states, cancellation/refund behavior, account requirements, and customer data requirements intact.

Do not silently “correct” apparent inconsistencies, add/remove/relabel an offer in a way that changes its meaning, invent policy, or change a business rule to make an interface easier to build. If a requested change appears to require a business change, pause that part of the work and ask the owner to explicitly authorize it. Proceed with independent visual work where possible. Approval must clearly say that business behavior may change and identify the affected rule or scope. Record any approved business change here before implementing it.

The owner’s explicit instructions in the current task take precedence over this brief. A vague request such as “make it better” is not approval to change business behavior. Never place a paid order, subscribe, charge a card, add wallet funds, send a gift, delete an account, or transmit a customer’s personal information as part of design testing.

## Product and business

NIXT is presented as a Saudi on-demand cleaning and care platform with two connected experiences:

1. **Book a service:** select a service and service-specific items (vehicle, carpet sizes, sofa items, tank types, or pest-treatment property size), choose an appointment and saved service address, optionally add products or care extras, then review payment details and submit a booking.
2. **Shop products:** browse goods and packages, add items and quantities to a cart, select a delivery address, apply a promo code, select payment, and place a store order.

The site is Arabic-first and right-to-left. It presents Saudi cities and Saudi riyal prices (ر.س). The observed signed-in account was a demo/business account with seeded example records. Treat names, phone numbers, addresses, dates, ratings, orders, wallet transactions, balances, subscriptions, and testimonials displayed in a running environment as sample data, not as verified production facts.

## Service catalog observed

### Car washing

The observed catalog contained five services:

- Exterior wash: displayed price 29 SAR, regular price 39 SAR; foam wax wash, glass, rims, and tire dressing.
- Interior wash: 45 SAR, regular 60 SAR; vacuum, interior surfaces, vents, and fragrance.
- Interior and exterior wash: base 48 SAR; wash, vacuum, interior detailing and other listed inclusions. Final price varies with selected vehicle class (the sample luxury vehicle showed 68 SAR and the sample sedan 48 SAR).
- Professional interior detailing: 249 SAR, regular 320 SAR.
- Hot steam wash and sanitizing: 150.64 SAR, regular 249 SAR.

The car-booking flow begins with choosing a registered vehicle or managing/adding one. Vehicle records include make, model, trim/class, year, color, and Saudi plate. Class drives applicable pricing. Then choose a date/time and service location, choose optional add-ons/care products and enter a note for the captain, review the order and payment method, and confirm. The experience describes an on-site mobile captain visit. The home/profile supports a saved vehicle list, default vehicle, and vehicle management.

### Carpet, curtains, and laundry-related catalog

The observed carpet service page contained four bookable offerings:

- Carpet wash priced per square metre, shown at 12 SAR/m² (regular 18 SAR/m²), with pickup/delivery and machine wash/steam/sanitizing/packaging described.
- Curtains steam cleaning in place: 90 SAR (regular 140 SAR).
- Another carpet wash offer: 5.50 SAR per listed unit (regular 11 SAR). Its checkout permits standard size items or custom dimensions.
- Duvets/linens: 12 SAR per listed unit (regular 24 SAR), with pickup/delivery.

The carpet checkout is materially different from car wash: select one or more predefined rug sizes/other item types, change quantities, or use the custom-dimension calculator. The calculator asks length and width in metres and estimates area × the displayed unit rate. Example observed: a 3m × 2m custom rug was priced at 72 SAR in the 12 SAR/m² offering and 33 SAR in the 5.50 SAR offering. The checkout then asks for appointment/date and pickup/service address, offers extras and related store products, supports a service note, then presents payment and booking confirmation.

The carpet order may require an on-site captain to verify the entered measurements. In the observed carpet order detail, payment was disabled pending that inspection; order status also described pickup, delivery to laundry, return-to-customer, and completion stages. Preserve this condition when the corresponding service/order flow uses it. Do not assume every rug offer follows an identical payment rule; keep the service’s own configured rule.

The site copy also described free pickup/delivery and 48-hour preparation for the carpet category. Keep the configured rules and copy consistent; do not infer new service guarantees from marketing text.

### Sofas and furniture

The observed category contained three bookable offerings:

- Sofa wash for 3 seats: 120 SAR (regular 160 SAR).
- Sofa/majlis cleaning and sanitizing: displayed base 25 SAR (regular 50 SAR), but checkout required selecting an item; itemized options began at 200 SAR.
- Leather/velvet sofa polishing and steam protection: 139 SAR (regular 190 SAR).

The checked sofa flow uses an item selector and quantity controls, rather than a vehicle selector or carpet-size selector. A sample item was “single chair with footrest,” displayed at 200 SAR; other options included 1–5 seats and 6–10 seats. After selection, continue through appointment/address, extras, payment, and confirmation. The category page describes service on-site without moving furniture.

### Water tanks

The category contained three offerings: upper tank cleaning (90 SAR, regular 130), ground tank cleaning (160 SAR, regular 220), and combined upper plus ground (220 SAR, regular 300). The observed checkout required selection among tank-type/capacity items; examples displayed 128, 192, 385, 515, and 710 SAR. It then follows the appointment/address, extras, and payment steps.

### Pest control

The observed catalog contained one pest-control and pesticide-spraying service: 160 SAR, regular 220. The checkout required selecting property size; examples included an apartment with 1–3 rooms at 385 SAR and an apartment with 5–7 rooms at 515 SAR. Then choose appointment/address, extras, and payment. The category describes low-odor treatment and a service guarantee; do not create or extend safety/guarantee claims beyond configured content.

### Other service categories

The landing page includes “other services” as coming soon. Do not represent it as bookable until the product configuration provides bookable items.

## Shared service-booking structure

The observed booking wizard has four stages, with stage-one labels adapting to service type:

1. Choose the service item: car/vehicle; carpet products and measurements; sofa pieces; tank items; or pest-treatment property size.
2. Select an available appointment date/time and the saved service address, or manage/add an address.
3. Select optional care extras/products and optionally add notes for the captain. Related store products may be addable to the service booking.
4. Apply a coupon if applicable, choose a supported payment method, review the order summary, and confirm the booking.

Keep an accurate summary visible through the flow: service, selected vehicle/items and quantities, date/time, address, base/line-item prices, extras, delivery fees if configured, tax as configured, and total. Buttons should reflect validation and the current step. Do not change step order, mandatory selections, price calculation, or payment gating as a visual redesign shortcut.

Payment choices shown on service/package screens include Mada/cards, Apple Pay, Tabby, Tamara, and wallet balance where applicable. The exact configured payment methods differ by context. Preserve checkout configuration instead of assuming every method appears in every flow.

## Store and product purchase

The store has categories for car products/accessories, carpet care/packaging, sofa/furniture care, wash packages/offers, and coming-soon products. Observed carpet-product examples included carpet storage bags, laundry liquid, carpet shampoo, a carpet brush, and carpet deodorizing powder. Products can have a detail page with gallery, description, rating, price/discount, add-to-cart action, and related products.

Observed store path: category/product → product detail or quick-add → cart quantity changes/removal → saved or changed delivery address → delivery estimate → promo-code entry → payment selection → order confirmation. The sample cart showed a 150 SAR free-shipping threshold, 15 SAR delivery below threshold, estimated delivery 1–3 working days, VAT included in the displayed total, Mada/cards/Apple Pay and installment options, and wallet balance when available. These are observed site values, not permission to hard-code them. Preserve the live configured shipping, tax, promo, and payment rules.

Service add-ons and direct store checkout are distinct contexts: service-related items may be carried by the captain, while ordinary store purchases are delivered to the customer. Keep this distinction clear in copy and order details.

## Packages and subscriptions

The packages area contains car-wash, carpet/upholstery, VIP, tank, and pest packages. Examples observed:

- Silver: 3 comprehensive interior/exterior washes, 117 SAR; listed as 39 SAR per wash.
- Gold: 5 comprehensive washes, 185 SAR; listed as 37 SAR per wash.
- Carpet offer: 4 rugs for the price of 3, displayed at 135 SAR.
- Diamond VIP: 8 washes plus detailing, 299 SAR.
- Home carpet package: 6 pieces, 199 SAR.
- Furniture-care and leather/velvet packages: 189 and 249 SAR.
- Tank packages: 169 and 299 SAR.
- Pest-control packages: 199 and 349 SAR.

Package detail pages explain included visits, benefits, validity, gifts, reviews, and payment options. Purchase starts with package selection and detail review, then payment choice and a final confirmation dialog. Do not press the final payment/subscribe control during testing.

The account’s subscription page shows active package, price, remaining visits, total visits, expiry, and benefits. Observed example subscriptions included a weekly gold car plan (3/4 washes remaining), VIP (6/8 remaining), and a carpet package (2/3 remaining). Values are seeded sample data.

## Account and customer profile

The observed account menu exposes profile/account, support, and sign-out. The account navigation includes:

- **Profile:** name, mobile number, email, editing/saving contact details, password change, and a sensitive account deletion request.
- **Orders:** service orders and store orders; detail pages show status/timeline, selected service/items or purchased products, vehicle where relevant, address, captain/delivery information, totals/tax/payment status, invoice, rebooking, and cancellation/refund controls. Carpet order detail may gate payment on measurement inspection.
- **Wallet:** enabled/disabled state, current balance, add funds, transaction list and filtering by transaction type/date. Observed top-ups have a minimum labelled as 15 SAR. Never initiate top-up or payment during testing.
- **Subscriptions:** active packages, remaining visits, validity, benefits; browse/buy more packages.
- **Vehicles:** list, default vehicle, add/edit/delete vehicle. Vehicle fields are make, model, class/trim, year, color, plate.
- **Addresses:** saved service addresses, active/default selection, add address via map/GPS or text, label (home/work/family/other), city, district, street, short national address, building, apartment/floor, landmark, and captain instructions. Do not request location permission without the owner/user’s explicit approval.
- **Rewards and gifts:** referral code and share, referral reward, send a package or wallet gift by recipient phone, choose gift amount/package, payment and send. Sending transmits information and may charge payment; do not submit during testing.
- **Settings:** master notification toggle, Arabic/English language choice, save/reset preferences.
- **Help and support:** topics for booking problems, service quality, payment, memberships/packages, and general questions.
- **Logout:** exits the authenticated session. Avoid logging out of the owner’s existing session just to inspect registration.

Registration/new-account flow was not observed because the site opened in an existing authenticated account. Do not claim its fields, validation, or verification rules from this brief. Inspect it only in a separate safe session or when the owner provides an appropriate test account; never discard the owner’s active session to test it.

## Accuracy notes and observed inconsistencies

The live demo displayed multiple apparent inconsistencies. Preserve this list as issues to investigate, not as permission to choose a new rule:

- Booking calendar default/sample dates showed August 2026 even though the site was inspected on 1 October 2026.
- The carpet category showed marketing and offer prices that differed across service cards, booking base prices, standard-size prices, and the custom-size calculator. A custom 3×2m rug was 72 SAR at 12 SAR/m², but 33 SAR at 5.50 SAR/m²; each service had a separate base price.
- The combined car wash had a 48 SAR base but charged by vehicle class, with a sample luxury car at 68 SAR.
- Sofa and tank service card prices differed from required selectable item prices in checkout.
- In a service summary, base price and itemized item amounts were added together; verify configured intended calculation before changing it.
- The cart showed 43 SAR subtotal, 15 SAR shipping and a 58 SAR total before quantity changes. Do not infer tax treatment or apply tax twice: the UI says VAT is included while also itemizing a tax amount.
- Store and service coupon codes are context-specific: CARPET20 was rejected in the general shopping cart. Do not make one coupon universally valid.
- Some demo order detail totals/labels did not appear to align with item cards. Treat as sample data/configuration problems; do not rewrite order history.

When implementing visual design, keep pricing and calculations driven by existing business data/configuration. Flag contradictions for the owner instead of changing the underlying rule.

## Redesign direction

The current site feels visually basic and template/AI-generated. The target is a distinctive, polished, high-end Saudi service brand with deliberate typography, strong editorial hierarchy, confident spacing, premium photography/art direction, refined surfaces and details, and carefully composed responsive layouts. Make the experience feel trustworthy, fast, and clear for both home cleaning and car care.

Use purposeful motion: restrained reveal/scroll transitions, clear state transitions in booking, animated selection/quantity feedback, tasteful offer/product movement, and polished loading/empty/success states. Motion must reinforce hierarchy and feedback, never delay booking, obscure prices, cause layout jumps, or create accessibility problems. Honor reduced-motion preferences, keyboard navigation, focus visibility, contrast, semantic labels, and RTL reading order. Keep mobile booking and shopping especially clear and thumb-friendly.

This redesign can alter visual styling, layout, typography, imagery, iconography, component composition, responsive behavior, and non-business animation behavior. It must preserve product and business rules listed above.

## Working expectations for Claude

- Read this file before every task and reread the relevant sections before editing.
- Inspect the existing project and reuse its current stack and data sources. Do not assume the repository is empty or select a replacement stack without authorization.
- Separate presentation work from business logic. Prefer presentation-layer changes and retain existing service/product IDs, content source, pricing functions, validation, state transitions, and checkout semantics.
- For every requested change, state briefly whether it affects presentation only or touches a business rule. If it touches a rule without explicit authorization, stop that portion and ask.
- Do not seed fake customer, payment, account, or order data into production flows. Demo values must remain visibly demo/test data.
- Do not claim a purchase, booking, account registration, or payment flow was tested end-to-end unless it was actually completed in a non-production test context.

