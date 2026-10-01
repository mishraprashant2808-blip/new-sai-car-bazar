# PAGE_01

Page 1 of 30

---

# PAGE_02

Technical Requirements Document (TRD)
New Sai Car Bazar - Used Car Dealership Platform
Document Version: 1.0
Date: 27 September 2026
Project Type: Full-stack, production-ready used-car dealership platform
Primary Location: Barabanki, Uttar Pradesh, India
Development Approach: Al-assisted / Vibe Coding
Target Deployment: GitHub + Vercel + Supabase
1. Project Overview
New Sai Car Bazar requires a modern, secure, responsive used-car dealership website based
on the provided visual references.
The system must not be a static marketing website. It must be a fully functional inventory
management platform where the authorized administrator can:
: Add vehicles
· Edit vehicles
: Upload/manage vehicle images
: Mark vehicles as featured/new arrival/hot deal
: Mark vehicles as sold
• Manage enquiries
· Manage finance enquiries
· Manage Sell My Car requests
: Manage vehicle inventory through an admin dashboard
Customers must be able to browse inventory without creating an account.
The platform will use Supabase for authentication, PostgresQL database, storage, and row-
level security.
2. Business Information
FieldRequirement Business NameNewSai Car BazarLocationBarabanki, UttarPradesh,India
InventorySizeLess than3ovehicles initially Inventory ManagementManual + csVbulk import
Admin UsersAdmin only Customer LoginOptional Customer EnquiryNo login required
PaymentsNot required WhatsAppYes Finance CalculatorYes LogoExisting logo will be provided
DomainNotpurchased yet GitHubNewrepositoryBackendSupabaseDeploymentVercel
Contact Information
Current requirements indicate:
:Phone:8858982362
: WhatsApp: 8172946630
Email:mishraprashant2808@gmail.com
Implementation note: the phone/WhatsApp numbers should be confirmed before production
deployment because the supplied screenshot and later requirement contain different
numbers.
3. Project Objectives
The system shall:
Page 2 of 30

---

# PAGE_03

1.Provideapremium used-car dealership website
1. Closely reproduce the visual style of the supplied screenshots.
1. Provide a responsive experience across desktop, tablet and mobile
1. Allow the administrator to manage the complete vehicle inventory.
1. Store inventory in Supabase PostgreSQL.
1. Store vehicle images in Supabase Storage.
1.Providesecureadminauthentication.
1. Protect database operations using Row Level Security.
1. Validate all user input on both client and server.
1. Provide enquiry and lead management.
1. Provide an EMl/finance calculator.
1. Provide WhatsApp and phone contact actions.
1. Support SEO-friendly vehicle pages.
1. Be deployable through GitHub -→ Vercel.
1. Be maintainable and extensible for future functionality.
4. Scope
4.1 In Scope
Public Website
: Homepage
· Header
: Navigation
· Search
: Browse by Make
· Featured Listings
: Inventory page
. Vehicle detail pages
. Vehicle filters
. Vehicle sorting
. Wishlist
• Finance calculator
· Finance enquiry
• Sell My Car
: Contact page
· About Us
· Footer
: WhatsApp integration
. Click-to-call
: Responsive design
Admin
Page 3 of 30

---

# PAGE_04

: Admin authentication
· Dashboard
· Inventory CRUD
: Vehicle image management
 Featured vehicles
 New arrivals
 Hot deals
: Sold/archived vehicles
· CSV import
• Enquiry management
: Finance enquiry management
: Sell My Car enquiry management
: Audit logging
• Basic site settings
Backend
:Supabase PostgreSQL
· Supabase Auth
: Supabase Storage
· RLS
· Server-side APIl/actions
. Validation
: Authorization
5. Out of Scope for Initial Version
The following should not be implemented unless specifically requested later
: Online vehicle payment
: Online booking payment
• Loan approval
: Banking integration
: Automated loan disbursement
• Full CRM
: Multi-dealer marketplace
:Dealer-to-dealerinventory
: Real-time auction
: Insurance purchase
: Vehicle registration API
: Automated valuation using third-party APls
The architecture should remain extensible enough to support these in future.
6. Technology Stack
Frontend
Next.js
TypeScript
React
Tailwind CSS
shadcn/ui
Backend
Page 4 of 30

---

# PAGE_05

Next.js ServerActions /Route Handlers
Supabase
PostgreSQL
Authentication
Supabase Auth
Storage
Supabase Storage
Validation
poz
React Hook Form
Source Control
Git
GitHub
Deployment
Vercel
7. High-Level Architecture
CUSTOMER
Next.js
Frontend
Server Actions
Route Handlers
Supabase
PostgreSQL
Auth
RLS
Storage
8. Ul/UX Requirements
The provided screenshots shall be treated as the primary visual reference.
8.1 Visual Direction
The website should use:
Page 5 of 30

---

# PAGE_06

: Dark navy backgrounds
· Red primary CTA
: White typography
: Large automotive photography
: Bold headings
: Rounded cards
: Spacious sections
: Premium dealership appearance
: Clear hierarchy
: Strong CTA buttons
Approximatecolorsystem:
Primary Red:
#ED0000
Dark Navy:
#101827
Secondary Navy:
#1C293A
White:
#FFFFFF
Light Background:
#F7F8FA
Final colors should be extracted/refined during implementation based on the supplied design.
9. Public Website Requirements
9.1 Header
Header shall contain:
: Business logo/name
: Search box
: Search button
· Account
. Wishlist indicator
: Navigation
Navigation:
All Vehicles
Home
Inventory
Browse by Make
Finance
Sell My Car
About Us
Contact
Mobile navigation must collapse into a responsive menu.
1o. Homepage
Homepage sections:
Hero
Content direction:
Page 6 of 30

---

# PAGE_07

QUALITYASSURED-CERTIFIEDPRE-OWNED
FIND YOUR PERFECT
USED CAR
Browse thoroughly inspected used vehicles.
Transparent pricing, full vehicle history,
and flexible finance options.
[ Browse Inventory ]
[ Finance Calculator ]
Hero background shall support an automotive image.
1o.1 Browse By Make
Makes shall be database-driven.
Example:
Toyota
Ford
Honda
BMW
Mercedes
Audi
Nissan
Jeep
Chevrolet
Volkswagen
Admin must be able to manage makes/models.
10.2 Featured Listings
The homepage shall display vehicles marked:
is_featured = true
Cards should support badges:
FEATURED
NEW ARRIVAL
HOT DEAL
The cards shall be database-driven.
11. Inventory Requirements
Route:
/inventory
Features:
Page 7 of 30

---

# PAGE_08

. Vehicle search
: Make filter
: Model filter
 Price range
. Year range
· Fuel type
: Transmission
 Body type
. Mileage
. Sorting
• Pagination if required
. Vehicle cards
. Vehicle status
Sorting options:
Newest
Price: Low to High
Price: High to Low
Mileage: Low to High
12. Vehicle Detail Page
Route:
/inventory/[slug]
Example:
/inventory/toyota-fortuner-2024
Page shall contain:
. Vehicle image gallery
· Primary image
: Thumbnail gallery
. Vehicle name
. Variant
• Price
. Year
. Mileage
• Fuel
: Transmission
• Body type
· Description
· Features
: Specifications
: Registration information where appropriate
: Vehicle history information where available
· Enquiry CTA
: Call CTA
: WhatsApp CTA
· Finance CTA
. Wishlist CTA
13. Vehicle Status
Page 8 of 30

---

# PAGE_09

Vehicle status values:
DRAFT
AVAILABLE
RESERVED
SOLD
ARCHIVED
Sold vehicles may optionally have a dedicated 'Sold" state/page depending on future SEO
requirements.
14. Inventory Data Model
Vehicles Table
vehicles
id
stock_number
slug
make_id
model_id
variant
year
price
mileage
fuel_type
transmission
body_type
color
registration_year
registration_number
vin
description
status
is_featured
is_new_arrival
is_hot_deal
created_at
updated_at
created_by
updated_by
Data Requirements
: stock_number must be unique.
: slug must be unique.
: price must be non-negative.
• mileage must be non-negative.
: year must be a valid vehicle year.
: Requiredfields must be validated.
: Status must use an approved enum/value set.
Page 9 of 30

---

# PAGE_10

15. Makes and Models
Makes
makes
id
name
slug
logo_url
is_active
created_at
updated_at
Models
models
id
make_id
name
slug
is_active
created_at
updated_at
Relationship:
Make
- Models
L Vehicles
16. Vehicle Images
Vehicle Images Table
vehicle_images
id
vehicle_id
storage_path
image_url
alt_text
sort_order
is_primary
created_at
Requirements:
Page 10 of 30

---

# PAGE_11

: Multiple images per vehicle
• Primary image
· Reordering
: Delete image
: Upload validation
• File size restrictions
: Allowed image formats
: Image optimization
Recommended formats:
JPG
JPEG
PNG
WEBP
17. Admin Authentication
Admin route:
/admin/login
Admin login shall use Supabase Auth.
No public admin signup.
Adminaccounts mustbe created/managedthrough controlled administrativeprocesses.
18. Admin Dashboard
Route:
/admin
Dashboard metrics:
Total Vehicles
Available
Reserved
Sold
Featured
New Arrivals
Hot Deals
New Enquiries
Additionaldashboardsections:
 Recent vehicles
: Recent enquiries
: Recent finance requests
• Recent Sell My Car requests
1g. Admin Inventory Management
Route:
/admin/inventory
Features:
Page 11 of 30

---

# PAGE_12

. View vehicles
. Search
• Fiter
· Add
· Edit
· Duplicate
· Archive
: Mark sold
: Mark available
: Feature
 Remove featured
: Delete where permitted
: CSV import
2o. Add/Edit Vehicle
Route:
/admin/inventory/new
/admin/inventory/[id]
Form sections:
Basic Information
• Make
: Model
. Variant
. Year
• Price
: Mileage
Specifications
• Fuel
: Transmission
• Body type
• Color
Registration
• Registration year
: Registration number
. VIN, if applicable
Description
Rich text or controlled text editor.
Features
Example:
ABS
Air Conditioning
Airbags
Sunroof
Parking Camera
Cruise Control
Alloy Wheels
Power Windows
Central Locking
Page 12 of 30

---

# PAGE_13

Images
Multi-image upload.
Marketing
Featured
New Arrival
Hot Deal
Status
Draft
Available
Reserved
Sold
Archived
21. CSV Import
Admin shall be able to upload a csV file containing vehicle information
Requirements:
1. Upload cSV.
1. Validate column headers.
1. Validate every row.
1. Show validation errors before import.
1.Allowusertocancel.
1. Import valid records.
1. Report failed records.
1.Prevent duplicate stocknumbers.
1. Generate an import summary.
Example:
Total Rows: 20
Valid: 18
Invalid: 2
Imported: 18
Failed: 2
22. Enquiry System
Customers do not need an account to submit enquiries.
Lead Table
Page 13 of 30

---

# PAGE_14

leads
id
vehicle_id
name
phone
email
message
source
status
created_at
updated_at
assigned_to
Status:
NEW
CONTACTED
FOLLOW_UP
CONVERTED
CLOSED
23. Enquiry Form
Required:
Name
Phone
Optional:
Email
Message
Vehicle information should automatically be associated with the enquiry.
Security requirements:
: Server-side validation
• Rate limiting
: CAPTCHA/anti-spam
: Input sanitization
: No direct database insertion from untrusted client code
24. WhatsApp
Vehicle detail page shall provide a WhatsApp CTA.
The message should automatically include vehicle context.
Example:
Hello, I am interested in the Toyota Fortuner 2024
listed on NewSai Car Bazar.
The WhatsApp number shall be configurable through site settings rather than hard-coded
throughout the application.
25. Click-to-Call
A call cTA shall use the configured dealership phone number.
Mobile:
te1:+91xxxxxxXxxX
Page 14 of 30

---

# PAGE_15

Desktop users may be shown the phone number.
26. Wishlist
Wishlist shall support:
Guest
Use browser/local storage.
Authenticated Customer
Store wishlist in database.
Wishlist Table
wishlists
id
user_id
vehicle_id
created_at
Unique constraint:
user_id + vehicle_id
27. Customer Authentication
Customer authentication is optional.
The public website must remain usable without login.
Customers must be able to:
 Browse vehicles
: Search
• Filter
. View details
· Enquire
. Call
. WhatsApp
. Use finance calculator
withoutauthentication.
Account functionality may be used for:
: Persistent wishlist
Futurecustomerfeatures
28. Finance Calculator
Route:
/finance
Inputs:
Vehicle Price
Down Payment
Interest Rate
Loan Tenure
Outputs:
Loan Amount
Monthly EMI
Total Interest
Total Payable
Page 15 of 30

---

# PAGE_16

EMI formula:
EMI = P × r × (1+r)^n / ((1+r)^n - 1)
Where:
P = principal
r = monthly interest rate
n = number of monthly payments
If the interest rate is zero, the calculator must handle that case separately.
2g. Vehicle-Specific Finance
From vehicle detail:
Finance This Car
shall open the calculator with:
Vehicle Price= selected vehicle price
pre-populated.
3o. Finance Enquiry
Finance enquiry fields:
Name
Phone
Email
Vehicle
Vehicle Price
Loan Amount
Down Payment
Preferred Tenure
Finance Leads Table
finance_leads
id
vehicle_id
name
phone
email
vehicle_price
loan_amount
down_payment
interest_rate
tenure
message
status
created_at
updated_at
Status:
NEW
CONTACTED
FOLLOW_UP
CLOSED
Page 16 of 30

---

# PAGE_17

31. Sell My Car
Route:
/sell-my-car
Fields:
Make
Model
Year
Mileage
Registration
Expected Price
Name
Phone
Email
Description
Photos
Sell Car Requests
sell_car_requests
id
make
model
year
mileage
registration
expected_price
name
phone
email
description
status
created_at
updated_at
32. About Us
The About page shall reproduce the visual direction of the provided reference.
Contentsectionsmayinclude:
.Why BuyFrom New Sai Car Bazar
: Certified inspection
. Vehicle history
· Flexible finance
: Customer support
·Business information
All claims about inspections, warranties, reports, financing etc. should only be displayed if
actually provided by the dealership
33. Contact Page
Page 17 of 30

---

# PAGE_18

Contact page should contain:
 Business name
• Location
· Phone
. WhatsApp
· Email
: Contact form
: Map/location section if desired
Contact form submissions should enter the lead system
34. Footer
Footer shall contain:
About Us
Short business description.
Quick Links
About Us
Contact Us
Sell My Car
Finance Options
More Info
Buying Guide
Car Value Estimator
FAQ
Terms & Conditions
New Arrivals
Email subscription Ul may be implemented as a future-ready component.
35. Database Security
Supabase Row Level Security is mandatory.
Public
Public users should only be able to read data explicitly intended for public consumption
Example:
AVAILABLEvehicles→public read
Private lead information must never be publicly readable.
36. Admin Authorization
Admin operations must be protected at multiple levels:
User Authentication
RoleVerification
Server Authorization
Supabase RLS
Database
Frontend-only authorization is prohibited.
Page 18 of 30

---

# PAGE_19

37. Sensitive Data
Thefollowing must neverbepubliclyexposed:
: Customerphone numbersfrom leads
: Customer email addresses
: Finance information
: Sell My Car submissions
: Admin data
·Service-role credentials
: Database credentials
· Private API keys
38. Environment Variables
Required environment variables will be managed through .env.local and Vercel environment
settings.
Example:
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
The service-role key must never be exposed to browser/client code.
.env.local must be excluded from Git.
39. Validation Requirements
Validation must happen on both:
Client
For user experience.
Server
For security.
Zod schemas should becentralized:
lib/validation/
- vehicle.ts
- lead.ts
-finance.ts
sell-car.ts
auth.ts
4o. File Upload Security
Uploaded files must be checked for:
• MIME type
· File extension
• File size
. Upload path
. User authorization
Only permitted imageformats should be accepted.
Server-side checks are mandatory.
41. Rate Limiting
Rate limiting should apply to public forms and sensitive endpoints:
Page 19 of 30

---

# PAGE_20

Contact
Vehicle Enquiry
Finance Enquiry
Sell My Car
Authentication
This helps prevent:
· Spam
: Brute-force login attempts
: Automated form abuse
· Excessive APl requests
42. CAPTCHA
Public forms should use a CAPTCHA/anti-bot mechanism such as Cloudflare Turnstile or an
equivalent service.
CAPTCHAverificationmusthappenserver-side.
43. Security Headers
compatible:
Content-Security-Policy
X-Content-Type-Options
Referrer-Policy
Permissions-Policy
Strict-Transport-Security
Frame protections
Configuration must not break required third-party services.
44. Audit Logs
Admin changes should be logged.
Audit Logs
audit_logs
id
user_id
action
entity_type
entity_id
old_data
new_data
ip_address
user_agent
created_at
Examples:
Page 20 of 30

---

# PAGE_21

VEHICLE_CREATED
VEHICLE_UPDATED
VEHICLE_ARCHIVED
VEHICLE_STATUS_CHANGED
IMAGE_UPLOADED
IMAGE_DELETED
LEAD_STATUS_CHANGED
Sensitive values should not be unnecessarily logged.
45. SEO Requirements
Each vehicle page should have:
 Unique title
: Meta description
: Canonical URL
: Open Graph metadata
: Social image
· Semantic HTML
: Structured data where appropriate
: SEO-friendly slug
Example:
/inventory/toyota-fortuner-2o24
not:
/car?id=1827
46. Performance Requirements
Target:
• Fast initial page load
: Optimized images
: Lazy-loaded images where appropriate
: Responsive image sizes
: Minimal client-side JavaScript
: Server-side rendering where appropriate
: Database queries limited to required fields
: Indexed searchable database fields
Images must not be loaded at their original massive resolution when a smaller optimized
version is sufficient.
47. Responsive Requirements
The website must work on:
Mobile
Tablet
Laptop
Desktop
Large Desktop
Critical pages:
Page 21 of 30

---

# PAGE_22

· Homepage
: Inventory
. Vehicle detail
· Finance
: Contact
: Admin dashboard
must all be responsive.
48. Accessibility
Target:
· Semantic HTML
: Keyboard navigation
. Visible focus states
: Accessible form labels
: Proper button semantics
: Alt text for vehicle images
 Sufficient color contrast
: Accessible modal/dialog behavior
49. Error Handling
User-facing errors should be friendly.
Example:
Something went wrong.
Please try again.
Technical details should not be exposed to users.
Server logs may contain technical information where appropriate, without exposing secrets or
sensitive customer data.
5o. Logging
Application logging shall support:
· Errors
: Authentication failures
:Importantadmin operations
: Server errors
: Import failures
Logs must not contain:
Passwords
API keys
Service-role keys
Full payment information
Unnecessary PII
51. GitHub Requirements
Repository:
new-sai-car-bazar
Recommended branches:
Page 22 of 30

---

# PAGE_23

main
development
feature/*
Pull requests should be used for significant changes once development expands.
52. Git Commit Standards
Recommended:
feat: add vehicle inventory
feat: add finance calculator
fix: correct vehicle filtering
security: update RLs policies
refactor: improve vehicle card
docs:updatesetupinstructions
53. Environment Separation
Minimum:
Development
Production
Recommended later:
Development
Preview
Production
Vercel preview deployments can be used for testing changes before production.
54. Supabase Storage Structure
Recommended:
vehicle-images/
{vehicle-id}/
01.webp
02.webp
03.webp
sell-car/
{request-id}/
01.webp
02.webp
Storage policies must prevent unauthorized uploads/deletes.
55. Database Indexes
Indexes should be created for commonly queried fields such as:
vehicles.status
vehicles.make_id
vehicles.model_id
vehicles.price
vehicles.year
vehicles.created_at
vehicles.slug
vehicles.stock_number
Page 23 of 30

---

# PAGE_24

56. Testing Requirements
Functional
Test:
: Admin login
: Add vehicle
 Edit vehicle
:Delete/archivevehicle
: Upload images
: Mark featured
: Mark sold
: Search
• Filters
: Sorting
• Enquiry
. WhatsApp
• Call
• Finance calculator
· Finance enquiry
• Sell My Car
: CSV import
. Wishlist
57. Security Testing
Test:
 Unauthorized admin access
: Direct database access
· RLS policies
• Invalid form data
: Malicious input
: File upload abuse
• Rate limiting
: CAPTCHA bypass attempts
: Session handling
: Role escalation
• Public access to private leads
58. Acceptance Criteria
The project will be considered MVP-complete when:
Public
Page 24 of 30

---

# PAGE_25

Homepagematcnessupplieddesigndirection.
: Responsive header works.
: Inventory loads from Supabase.
: Search works.
: Fiters work.
. Vehicle detail pages work.
: Images load from storage.
: Enquiry works without login.
: Call button works.
: WhatsApp works.
: Finance calculator works.
: Finance enquiry works.
: Sell My Car works.
. Wishlist works.
: About/Contact pages work.
Admin
: Admin login works.
: Unauthorized users cannot access admin.
. Vehicle CRUD works.
: Images can be uploaded.
: Images can be reordered.
: Featured status works.
: New Arrival works.
: Hot Deal works.
: Sold status works.
: csV import works.
: Leads are visible.
: Lead status can be updated.
: Finance leads are visible
: Sell My Car leads are visible.
: Audit logging works.
Security
: RLS enabled.
: Private data protected.
:Server validation implemented.
: Client validation implemented.
: Secrets not committed.
: Service-role key not exposed.
: Upload validation implemented.
: Rate limiting implemented.
: CAPTCHA implemented.
: Production security headers configured.
59. Deployment Requirements
Final architecture:
Page 25 of 30

---

# PAGE_26

GILHUD
Vercel
Next.js
Supabase
Auth
PostgreSQL
Storage
Deployment sequence:
1. Create GitHub repository
2. Create Supabase project
3. Configure database
4. Configure RLS
5. Configure Storage
6. Configure Auth
7.
Build application
8. Push to GitHub
9. Connect GitHub to Vercel
1o.Configureenvironmentvariables
11.Deploy preview
12. Test
13.Deploy production
14. Connect custom domain later
6o. Future Domain
Since no domain currently exists, initial deployment can use the Vercel-provided URL.
Once the business purchases a domain:
Domain
Vercel
New Sai Car Bazar
SSL should be automatically configured through the deployment platform.
61. Recommended Development Phases
Phase 1 - Project Foundation
Next.js
TypeScript
Tailwind
shadcn
GitHub
Environment setup
Page 26 of 30

---

# PAGE_27

Phase 2 - UI
Header
Navbar
Hero
Browse by Make
Featured Vehicles
Trust Section
Footer
Responsive design
Phase 3 - Supabase
Database
Auth
Storage
RLS
Migrations
Seed data
Phase 4 - Inventory
CRUD
Images
Search
Filters
Sorting
Vehicle details
Phase 5  Admin
Dashboard
Inventory manager
cSv import
Lead management
Audit logs
Phase 6 - Customer Features
Enquiries
Wishlist
Finance
Sell My Car
WhatsApp
Call
Phase 7 - Security
RLS
Validation
Rate limiting
CAPTCHA
Headers
Upload security
Authorization
Phase 8 - Testing
Ciinr+ian-l
Page 27 of 30

---

# PAGE_28

Security
Responsive
Performance
SEO
Accessibility
Phase 9 - Deployment
GitHub
Vercel
Supabase
Production
62. Al/Vibe-Coding Development Rules
Because this project will be built with Al assistance, the coding agent must follow these rules:
Rule 1
Do not build everything in one giant generation.
Build incrementally.
Rule 2
Do not hard-code inventory.
Vehicle datamust comefrom Supabase.
Rule 3
Do not trust client-side authorization.
All privileged operations require server-side authorization and database policies.
Rule 4
Do not expose secrets.
Never place:
SUPABASE_SERVICE_ROLE_KEY
database credentials
private API keys
in client code.
Rule 5
Do not destroy existing functionality while implementing new features.
Rule 6
After each major feature:
Build
Lint
Type-check
Test
Review
Rule 7
Database changes must use versioned migrations
Rule 8
Do not use fake/mock inventory in production.
Seed data may be used only for development.
63. Definition of Done
Afaatiiraicnntnnciaradrnmnlatamaralharaiicaitcllavictc
Page 28 of 30

---

# PAGE_29

For example:
"Add Vehicle" is complete only when:
UI
Validation
Authorization
Server operation
Database
Image Storage
Public Inventory
Error handling
Testing
all work correctly.
The same principle applies to every major feature.
64. Initial MVP
The first production milestone shall include:
/Premiiimresnnnsive hnmenage
Page 29of 30

---

# PAGE_30

V Inventory
V Vehicle detail
√ Search
V Filters
V Admin authentication
V Admin dashboard
V Vehicle CRUD
V Image upload
Supabase database
V Supabase storage
V RLS
V Server validation
VE
Enquiry system
√ WhatsApp
Call
Finance calculator
Finance enquiry
Sell My Car
V Wishlist
csv inventory import
V Audit logs
√ GitHub
V Vercel deployment
65. Pending Business Inputs
The following remain to be finalized before production:
ItemStatus LogoAwaiting upload Exact showroom addressPending Phone number
confirmationPending WhatsApp number confirmationProvided: 817294663o Default EMI
repositoryTo be created
Page 30 of 30