# San Diego County Small-Business Landscape for an AI Phone Receptionist (Home-Service Trades and Restaurants), as of 2026-10-13

> **Method note for the report writer.** This research environment could not reach the primary federal and state data hosts. api.census.gov, www.census.gov, www.bls.gov, data.bls.gov, censusreporter.org and www.cslb.ca.gov all failed with DNS or proxy 403 errors from both WebFetch and curl. Every figure below therefore comes from search-engine snippets of the cited pages, not from pages read in full. As a result, **no current (2022/2023) County Business Patterns or Nonemployer Statistics counts by 6-digit NAICS for San Diego County were retrieved.** The exact queries to pull them are listed under Gaps in Section 1. Treat every number marked "Inference" or "estimate" as the researcher's own derivation, not a sourced fact.

## 1. How many plumbing, electrical, HVAC, handyman/GC, roofing establishments and restaurants are in San Diego County?

### Takeaway
I could not retrieve current Census CBP counts by trade. The best sourced anchors are:
- About 6,586 construction employer establishments (all of NAICS 23) in 2015.
- About 22,944 construction firms including nonemployers (2012).
- About 11,594 restaurants countywide, a figure from a restaurateur-cited survey reported in the press in March 2026.

Home-service trades plus restaurants in the county most likely number in the low tens of thousands of businesses (estimate).

### Cited Findings
**Construction / trades**
- 2015 Census County Business Patterns: 6,586 construction establishments with paid employees in San Diego County. "The great majority of construction firms in San Diego County are very small, 64% have 4 or fewer employees." — [City of San Diego / SDUSD 2017 Construction Demographics Report](https://www.sandiego.gov/sites/default/files/2017-sdusd-construction-demographics-report.pdf)
- 2012 Census Survey of Business Owners: "of the total of 22,944 construction firms located in San Diego, the majority, 73% (16,689), had no paid employees." — [same report](https://www.sandiego.gov/sites/default/files/2017-sdusd-construction-demographics-report.pdf)
- CSLB's Public Data Portal publishes a "List of Contractors by Classification and County". That is the authoritative route to San Diego counts of C-10 (electrical), C-36 (plumbing), C-20 (HVAC), C-39 (roofing) and B (general building) licenses, but it could not be accessed. — [CSLB Public Data Portal](https://www.cslb.ca.gov/onlineservices/dataportal/)
- Statewide context: about 231,261 active CSLB licenses (CSLB homepage, 2026). About 25,875 active C-10 and 15,859 active C-36 licenses statewide as of 2020-12-31. — [CSLB home](https://www.cslb.ca.gov/); [Wikipedia: CSLB](https://en.wikipedia.org/wiki/California_Contractors_State_License_Board)
- A third-party site cites about 27,000+ C-10 and 17,000+ C-36 licenses statewide. The figures are rounded and undated, so they are low reliability. — [contractorlicensecheck.com](https://contractorlicensecheck.com/data/contractor-license-types-california)
- Directory counts are not establishment counts, but they indicate density:
  - Enigma lists 119 "HVAC contractor" entities in the City of San Diego. — [Enigma](https://www.enigma.com/directory/ca/san-diego/hvac-contractor)
  - BBB returns 936 "heating contractors" and 4,355 "heating and air conditioning" results near San Diego (wider area). — [BBB](https://www.bbb.org/us/ca/san-diego/category/heating-and-air-conditioning)
  - Houzz shows 1,499 San Diego design-build firms. — [Houzz](https://www.houzz.com/professionals/design-build/san-diego-ca-us-probr0-bo~t_11793~r_5391811)

**Restaurants**
- About 11,594 restaurants countywide. The figure comes from a restaurateur's account of a November 2025 survey, reported by Times of San Diego. In that survey, 7% of the county's restaurants said they were closing an additional day per week. — [Times of San Diego, 2026-03-01](https://timesofsandiego.com/business/2026/03/01/san-diego-restaurants-closing-rent-wages/)
- A commercial database counts 6,238 distinct restaurants within about 25 miles of San Diego as of July 2026 (not a Census figure; the geography differs). — [re2.ai](https://re2.ai/data/restaurants/san-diego-ca)
- An unsourced market guide gives about 4,986 restaurants in the City of San Diego (low reliability). — [OysterLink](https://oysterlink.com/spotlight/how-many-restaurants-san-diego/)
- The County DEH Food & Housing Division regulates all retail food facilities. Its "Food Facilities" open dataset on CivicData was last updated 2023-12-05 and is the route to an exact permit-based count. — [CivicData: DEH FHD Food Facilities](https://civicdata.com/dataset/deh_fhd_food_facilities_proposed_17903/resource/b689edd2-83ce-4f80-961e-cde03d1f5e41)

**All industries**
- San Diego County had 309,797 nonemployer establishments in 2024, all industries (Census QuickFacts). — [Census QuickFacts San Diego County](https://www.census.gov/quickfacts/sandiegocountycalifornia)

### Inferences
- **Restaurant count.** The 11,594 figure most likely counts all food-service locations, including limited-service, chains and possibly bars and cafés. Full-service plus limited-service restaurants (722511 + 722513) with paid employees are probably in the 6,000-8,000 range countywide. This is an estimate that needs a CBP check.
- **Trade counts.** The construction employer base was 6,586 in 2015. Construction activity has grown since, and specialty trades (NAICS 238) typically make up roughly two-thirds of construction establishments. On that basis I estimate:
  - About 4,500-5,500 specialty-trade employer establishments in the county today.
  - Of those, plumbing/HVAC (238220) and electrical (238210) are the two largest 6-digit codes, likely around 1,000-1,500 and around 900-1,300 employer establishments respectively.
  - All of these numbers are researcher estimates and must be verified against CBP 2023.
- **Including nonemployers.** If the 2012 ratio (73% nonemployer) still holds roughly, total construction businesses including nonemployers would be on the order of 25,000-35,000 in the county (estimate). Many nonemployer "handyman/remodel" operators fall under 236118 or 238990.

### Gaps
- No CBP 2022/2023 or NES 2022/2023 counts by NAICS were retrieved, because the Census hosts were unreachable. To pull them:
  - `https://api.census.gov/data/2023/cbp?get=NAICS2017,NAICS2017_LABEL,ESTAB,EMP,PAYANN,EMPSZES&for=county:073&in=state:06&NAICS2017=238220` (repeat for 238210, 236118, 238160, 2382, 722511, 722513)
  - Nonemployer: `https://api.census.gov/data/2022/nonemp?get=NAICS2017,NESTAB,NRCPTOT&for=county:073&in=state:06&NAICS2017=...`
- No San Diego County CSLB license counts by classification (C-10, C-20, C-36, C-39, B, D-type handyman exemption). Pull from the CSLB data portal list by classification and county.
- No California Restaurant Association county membership or count data was found. The CRA San Diego chapter's figure of 180+ restaurants appears to relate to Restaurant Week participation, not total members. — [SD Tourism Authority member listing](https://www.sandiego.org/members/associations-organizations/california-restaurant-association-san-diego-county.aspx)
- Handymen are hard to count: California lets unlicensed handymen do jobs under $500 (soon $1,000 under recent legislation; not verified here), so many never appear in CSLB data.

## 2. What share are sole proprietors / nonemployers (on the job, missing calls)?

### Takeaway
Most San Diego construction businesses have no employees:
- 73% of construction firms had no paid employees (2012 SBO).
- 64% of employer construction firms had 4 or fewer employees (2015 CBP).

Together these mean roughly 9 in 10 trade businesses are run by an owner-operator or a micro-crew, which is the core "on a ladder, can't answer" buyer.

### Cited Findings
- 73% (16,689 of 22,944) of San Diego construction firms had no paid employees in 2012. — [SDUSD 2017 Construction Demographics Report](https://www.sandiego.gov/sites/default/files/2017-sdusd-construction-demographics-report.pdf)
- 64% of San Diego construction employer firms had 4 or fewer employees (2015 data). — [same](https://www.sandiego.gov/sites/default/files/2017-sdusd-construction-demographics-report.pdf)
- Nonemployer statistics are "primarily comprised of sole proprietorship businesses," with some partnerships and corporations. — [Census QuickFacts note](https://www.census.gov/quickfacts/fact/note/US/NES010219)
- Sole proprietorships make up over 42% of entities among City of San Diego business tax certificate holders (all industries). — [Open Data San Diego](https://opendatasandiego.com/business-tax-certificates)
- CPWR's Construction Chart Book breaks nonemployer establishments and revenue down by construction subsector nationally. It is useful for subsector ratios such as the nonemployer share in 238220 vs 238160. — [CPWR Chart Book](https://www.cpwr.com/research/data-center/the-construction-chart-book/interactive-7th/industry-businesses/nonemployer/)

### Inferences
- Combining the two figures: about 73% are nonemployers, and 64% of the remaining 27% have 1-4 employees. That puts roughly 90% of SD construction firms at 0-4 employees (inference from 2012/2015 data).
- **Restaurants have the reverse profile.** Nearly all have staff, but those staff are busy during service, so the pain is peak-hour overload rather than absence.
- Trade-specific nonemployer shares (for example, roofing vs. HVAC) for SD were not retrieved. Nationally, handyman/remodeling and painting skew heavily nonemployer, while HVAC and electrical have more employer firms. That national pattern is general knowledge, not a sourced finding here.

### Gaps
- No 2022/2023 NES-to-CBP ratio by 6-digit trade for San Diego County (Census access blocked).

## 3. Missed-call statistics for trades and restaurants (applicable to SD)

### Takeaway
There is no independent, peer-reviewed measurement of missed calls. Figures come from vendors and conflict widely:
- **Trades:** 22% to 62% of calls missed, with a more defensible middle around 27-45%.
- **Restaurants:** 25-43% of calls missed during peaks.

The strongest consumer-side datapoint is a Harris Poll finding that 69% of Americans would give up on a restaurant that doesn't answer.

### Cited Findings
**Trades**
- 27% of inbound calls to home-service businesses go unanswered, described as a 2024-2026 rolling average from Invoca call logs across HVAC, plumbing, roofing and electrical (as reported by a vendor). — [Higrovi 2026 Contractor Missed Call Report](https://www.higrovi.com/blog/contractor-missed-call-report-2026)
- 45% miss rate for home services (HVAC, plumbing), per a vendor table. — [SkipCalls](https://skipcalls.com/blog/percentage-business-calls-unanswered-statistics-2026)
- The widely repeated "62% of calls go unanswered" is attributed by vendors to a ServiceTitan study of 50,000+ lines, but the primary study was not found. — [ContractorInCharge](https://contractorincharge.com/blog/missed-call-statistics-for-home-service-companies); [Aira](https://www.getaira.io/blog/missed-business-calls-statistics)
- 22% for HVAC, attributed to "IBISWorld HVAC Industry Report 2024" (unverified attribution). — [CallJolt HVAC stats](https://calljolt.com/blog/hvac/hvac-industry-missed-call-statistics-2026)
- After-hours calls are 35-45% of inbound volume for HVAC and plumbing, and the pickup rate for traditional shops is under 18% ("ServiceTitan 2026 panel data", per vendor). 41% of weekend home-service calls go unanswered. — [CallJolt home-service stats](https://calljolt.com/blog/guides/home-service-business-missed-call-statistics)
- One vendor's unsourced estimate: solo operators miss 68-75% of calls, and 2-5 person companies miss 55-65%. — [CallJolt](https://calljolt.com/blog/guides/home-service-business-missed-call-statistics)
- Modeled losses of $45K-$120K per year per HVAC/plumbing contractor, and "$126K per year" for small businesses. These are vendor models, not measurements. — [VoIP-Int](https://voip-int.com/blog/voip-international-blog-posts-4/hvac-contractors-lose-45k-120k-a-year-to-missed-calls-here-s-the-real-data-273); [Phone2](https://www.phone2.io/post/true-cost-of-missed-calls)

**Restaurants**
- "43% of restaurant calls go unanswered", attributed to a February 2025 Breez study. The primary study was not found and the figure is promoted by AI-voice vendors. — [Hostie](https://hostie.ai/resources/missed-calls-cost-restaurants-43-percent-revenue-ai-phone-answering-2025)
- 25-40% of inbound restaurant calls go unanswered during peak hours (Popmenu 2024, as cited by a vendor). — [BiteBuddy](https://bitebuddy.ai/blog/restaurant-phone-statistics-2026)
- Harris Poll for Hostie (n=2,065 US adults, ±2.5 pts):
  - 69% are likely to give up on a restaurant if no one answers.
  - 20% say their calls to restaurants are always or often ignored.
  - [Hospitality Tech](https://hospitalitytech.com/missed-connection-over-two-thirds-americans-would-ditch-restaurants-dont-answer-phone)
- "$292K per year recovered" and "$20B industry loss" claims are vendor marketing and unverified. — [Hostie](https://hostie.ai/resources/stopping-43-percent-revenue-leak-hostie-ai-recovers-292k-missed-restaurant-calls)

### Inferences
- **A conservative planning assumption for SD trades:** about 25-35% of calls are missed overall, rising sharply for solo operators and after hours. For pitching, the Invoca-derived 27% is the most defensible figure, because it comes from actual call-log data, albeit vendor-reported.
- **Value of a missed call.** Average SD service-ticket values were not sourced. SD plumbing cost guides exist (see [plumbingpriceguide.com](https://plumbingpriceguide.com/san-diego-plumbing-cost/), [Biddaro](https://www.biddaro.com/us/cost/plumbing/san-diego)), but their figures were not retrieved. Under SD's high cost structure, one missed emergency plumbing or HVAC job is likely worth several hundred dollars in ticket value, and far more for replacements or roofing. This is an inference, not a sourced number.

### Gaps
- No primary study (ServiceTitan, Invoca, Breez) could be read directly.
- No San Diego-specific missed-call data.
- No sourced SD average ticket or job value by trade.

## 4. What do San Diego businesses pay today for answering services or receptionists?

### Takeaway
An in-house receptionist in the San Diego MSA costs about $20.76/hour mean wage (May 2024 BLS), or roughly $43K/year before payroll taxes and benefits. City minimum wage is $17.75 in 2026. Alternatives cost:
- Live answering services: about $200-450/month with overage fees.
- Local AI-receptionist competitors: $199-$997/month.

### Cited Findings
**Labor costs**
- BLS OEWS May 2024, San Diego-Chula Vista-Carlsbad MSA (released 2025-05-01):
  - Receptionists and Information Clerks: mean $20.76/hour.
  - Hotel, motel and resort desk clerks: $20.00.
  - All-occupation mean: $37.85 (vs. $32.66 nationally).
  - [BLS Western Information Office, May 2024 SD release](https://www.bls.gov/regions/west/news-release/OccupationalEmploymentAndWages_SanDiego.htm)
- National receptionist mean was $17.59/hour (May 2023), so SD runs about 18% above national. — [BLS OES 43-4171](https://www.bls.gov/Oes/current/oes434171.htm)
- City of San Diego minimum wage is $17.75/hour effective 2026-01-01, up from $17.25. The California state minimum is $16.90 in 2026. — [City of San Diego release](https://www.sandiego.gov/sites/default/files/2025-12/2025-12-31-city-of-san-diego-hourly-minimum-wage-will-increase-to-17.75-effective-jan-1-2026.pdf)
- A city hospitality wage started 2026-07-01: $19.00 for hotels with 150+ rooms and amusement parks, $21.06 for event centers, rising to $25 by 2030. It does not apply to restaurants generally. — [CalChamber HRWatchdog](https://hrwatchdog.calchamber.com/2025/10/city-of-san-diego-raises-wages-for-certain-hospitality-employees/)

**Answering services and AI competitors**
- Live answering services (national contractor guide): about $200-$450/month for 50-100 minutes, with $1.50-$2.50/minute overage. Entry plans: Davinci about $129/month, PATLive about $199/month, Ruby and AnswerConnect about $329/month. — [OnCallClerk 2026 pricing](https://www.oncallclerk.com/blog/answering-service-cost-for-contractors)
- San Diego-marketed services:
  - Cascade Answering: "less than $1 per minute," no contracts. — [Cascade Answering](https://www.cascadeanswering.com/california/san-diego)
  - Responsive Answering: per-minute plans from $29/month. — [Responsive Answering](https://responsiveanswering.com/california/san-diego-answering-service/)
- AI receptionists already targeting San Diego plumbers (local competition):
  - PickupBell: $199/month flat. — [PickupBell SD](https://www.pickupbell.com/plumbing-receptionist/san-diego-ca)
  - Local Call AI: $297/month with 250 minutes. — [Local Call AI](https://getlocalcall.com/plumbing-answering-service/san-diego-ca)
  - Human Add AI: $497/month (200 calls) or $997/month unlimited. — [Human Add AI](https://humanaddai.com/locations/san-diego-ca/plumbing/)
- National flat-rate AI receptionists cited at $29-$99/month. — [OnCallClerk](https://www.oncallclerk.com/blog/answering-service-cost-for-contractors)

### Inferences
- **Fully loaded receptionist cost.** $20.76 × 2,080 hours ≈ $43,180/year in wages. Adding California employer taxes and benefits (typically +20-30%) gives about $52-56K/year (estimate).
- **Price anchors for an AI product.** A $150-$300/month offering is under 1% of a receptionist's cost and sits in the middle of local AI competitor pricing.
- **Competition.** At least three AI-receptionist vendors already run San Diego-specific plumbing landing pages, so the local SEO and paid channel is already contested.

### Gaps
- No 2025 OEWS (May 2025) SD figures retrieved. BLS normally releases them in spring 2026, so a newer number likely exists.
- No median wage, and no switchboard/answering-service operator (43-2011) wage for SD.
- No survey of how SD trades currently handle calls (owner's cell, spouse or office manager, voicemail, answering service share).

## 5. Local factors: bilingual demand, cost of living, tourism, housing age, Google competition

### Takeaway
San Diego favors a bilingual AI receptionist:
- About 37% of residents speak a non-English language at home, and about two-thirds of those speak Spanish, so roughly a quarter of all residents speak Spanish at home (inference).
- In South Bay areas such as Chula Vista West and National City, Spanish is the primary household language for a majority.

Other local factors:
- Housing stock median year built is 1980, which drives repair demand.
- Tourism is steady (32.4M visitors, $14.4B spending in 2025).
- Restaurants are under severe cost pressure.

### Cited Findings
**Language**
- "Language other than English spoken at home" is 37.3% of persons age 5+ (ACS 2020-2024). — [Census QuickFacts](https://www.census.gov/quickfacts/fact/table/sandiegocountycalifornia/POP815220)
- About two-thirds (66.1%) of county residents who speak a non-English language at home speak Spanish. — [CPEHN Friday Facts](https://cpehn.org/about-us/blog/friday-facts-english-proficiency-language-san-diego-county/)
- Spanish as the primary household language (ACS 2024, by PUMA):
  - 57.6% in Chula Vista (West) and National City. — [DataUSA](https://datausa.io/profile/geo/san-diego-county-southwest-chula-vista-west-national-city-cities-puma-ca)
  - 26.7% in Lemon Grove, La Presa and Spring Valley. — [DataUSA](https://la.datausa.io/profile/geo/san-diego-county-south-central-lemon-grove-city-la-presa-spring-valley-puma-ca)
  - 23.2% in Fallbrook, Alpine and Valley Center. — [DataUSA](https://datausa.io/profile/geo/san-diego-county-north-east-fallbrook-alpine-valley-center-puma-ca)
  - 14.9% in Clairemont and Kearny Mesa. — [DataUSA](https://datausa.io/profile/geo/79500US0607315)
  - 7.8% in Encinitas and San Dieguito. — [DataUSA](https://datausa.io/profile/geo/san-diego-county-west-san-diego-northwestsan-dieguito-encinitas-cities-puma-ca)
- The County runs a formal language-access program, and a county atlas maps linguistic isolation. — [County Language Access](https://www.sandiegocounty.gov/language-access/); [Linguistic Isolation atlas](https://www.sandiegocounty.gov/content/dam/sdc/hhsa/programs/phs/CHS/CHS_Maps/7_Linguistic%20Isolation_FINAL.pdf)

**Housing**
- The median year homes were built in San Diego County is 1980. About 4.1% were built in 1939 or earlier, out of about 1.24M housing units. — [Point2Homes](https://www.point2homes.com/US/Neighborhood/CA/San-Diego-County-Demographics.html); [PropertyShark](https://www.propertyshark.com/mason/market-trends/residential/ca/san-diego)
- Nationally, about 48% of owner-occupied homes were built before 1980. — [NAHB Eye on Housing, Apr 2025](https://eyeonhousing.org/2025/04/almost-half-of-the-owner-occupied-homes-built-before-1980/)

**Tourism**
- San Diego Tourism Authority Fast Facts:
  - Total visitors: 32.5M in 2024 and 32.4M in 2025.
  - 2025 visitor spending: $14.4B.
  - 2025 total economic impact: $20B.
  - [SDTA Fast Facts 2026](https://www.sandiego.org/about/san-diego-tourism-fast-facts)
- FY2024: about 32M visitors and a record $14.6B in direct spending. — [SDTA press release](https://www.sandiego.org/press/press-releases/2024/70th-annual-meeting.aspx)

**Restaurant economics**
- 2026 reporting calls this the "toughest survival stretch since the Great Depression" for SD restaurants. Drivers: wages, rents, food costs and tariffs. Closures were reported across North Park, Hillcrest, Little Italy, East Village and Bankers Hill. — [Times of San Diego](https://timesofsandiego.com/business/2026/03/01/san-diego-restaurants-closing-rent-wages/)
- The CRA San Diego chapter president cited slow permitting and inspections as a burden. — [KOGO](https://kogo.iheart.com/featured/kogo-local-news/content/2026-03-03-san-diego-restaurants-fighting-to-stay-afloat/)

**Google competition**
- No San Diego-specific Local Services Ads pricing was found. National benchmarks:
  - LSA leads: $2-$20+ per lead. — [Podium](https://www.podium.com/google-reviews/google-local-services-ads/)
  - Plumbing search-ad leads: $25-$80+ per lead; clicks $5-$30+, and $50+ in competitive markets. — [Housecall Pro](https://www.housecallpro.com/resources/google-ads-for-plumbers/)
  - Home-services Google Ads cost per lead: $18-35. — [ClicksGeek](https://clicksgeek.com/google-ads-cost-per-lead-for-plumbing/)
  - Plumbing is described as one of the most competitive local categories.

### Inferences
- **Spanish speakers.** 37.3% × 66.1% ≈ 24.7% of SD County residents age 5+ speak Spanish at home (inference). That is roughly 750,000 people, given a county population of about 3.3M (not verified here).
- **Bilingual priority areas.** South County (Chula Vista, National City, San Ysidro, Otay) and inland North County (Escondido, Vista, Fallbrook) are where Spanish call handling matters most. Spanish-speaking callers also include many trade workers and owners.
- **Repair demand.** Half the county's housing is over 45 years old (median 1980), which supports steady repair demand for plumbing (galvanized and cast-iron pipe), electrical panel upgrades and roofing.
- **Lead economics.** When a contractor pays $25-$80 per paid lead, a missed call is a wasted ad spend, which gives a direct ROI pitch.
- **Seasonality (inference, unsourced).** SD's mild coastal climate flattens HVAC demand on the coast. Inland East County and North County get heat-wave spikes (typically Aug-Oct) that flood HVAC lines. Roofing and plumbing spike around winter storms (Dec-Mar). Restaurant volume peaks in summer tourism and around Comic-Con, conventions and holidays.

### Gaps
- No exact countywide ACS B16001 share of Spanish speakers, and no limited-English-proficiency share among Spanish speakers.
- No SD-specific LSA cost-per-lead or count of LSA advertisers per trade.
- No sourced seasonality data (call volume by month) for SD trades or restaurants.
- No cost-of-living index retrieved. The BLS all-occupation mean wage of $37.85 vs. $32.66 nationally (above) is the best proxy.

## 6. Local organizations, hubs, supply houses and events

### Takeaway
Reachable channels include:
- **BNI San Diego:** 31 chapters and about 850 members.
- **PHCC San Diego:** its annual Trades Expo was held 2026-01-31 at the Del Mar Fairgrounds.
- **ABC San Diego:** dense fall 2026 event calendar.
- **CRA San Diego County chapter** (restaurants).
- **County "Build Together" construction networking events.**

The search returned no information on IEC/NECA San Diego, BIA San Diego, ACCA, or the supply houses (Ferguson, Johnstone, Winsupply).

### Cited Findings
- BNI San Diego region: 31 chapters and about 850 members (executive director Ed Wilson). A new East County chapter, "East County Networkers," launched with 39 members and grew to 46 within a month. — [East County Magazine](https://eastcountymagazine.org/?p=126673)
- PHCC San Diego Trades Expo was held 2026-01-31 at the Del Mar Fairgrounds. It is an annual event, so the next one is likely early 2027 (not confirmed). — [PHCP Pros](https://www.phcppros.com/articles/22317-phcc-san-diego-trades-expo-returns-jan-31-2026)
- ABC San Diego (merit-shop contractors), 2026 events:
  - Excellence in Construction Awards and 50th Anniversary Gala, 2026-10-03.
  - "Crush It!" seminar, 2026-10-22/23.
  - Local Craft Championships, 2026-11-07.
  - [ABC San Diego events](https://abcsd.org/category/events/)
- County of San Diego "Build Together" construction networking event. — [County of San Diego](https://www.sandiegocounty.gov/events/build-together-construction-networking-event/)
- San Diego Trades Association: "Meet the Trades" event, 2026-08-22. — [SCTA SD](https://www.sctasd.org/membership-opportunities-for-2026-with-the-san-diego-trades-association)
- National Hispanic Construction Alliance San Diego holds business mixers, a fit for a bilingual offering. — [NHCA events](https://nhca.pro/events/)
- CMAA San Diego mixer, 2026-10-15 in Point Loma. — [CMAA SD](https://cmaa-sd.org/)
- AGC San Diego publishes a weekly Construction Reporter (2026-09-30 issue seen). — [AGC SD Construction Reporter PDF](https://db.onlineplanservice.com/upload/AGCS/ConstructionReporter.pdf)
- PCBC 2026 (homebuilding) and the AIA Conference (2026-06-10/13) were held at the San Diego Convention Center. — [Exponents](https://www.exponents.com/our-blog/the-10-hottest-trade-shows-in-san-diego/)
- California Restaurant Association San Diego County chapter is listed as an SDTA member organization. — [SDTA](https://www.sandiego.org/members/associations-organizations/california-restaurant-association-san-diego-county.aspx)
- San Diego Restaurant Week: 100+ participating restaurants, from Oceanside to Chula Vista (January 2025). — [Times of San Diego](https://timesofsandiego.com/life/2025/01/08/hungry-8-days-100-restaurants-san-diego-restaurant-weeks-2025-lineup-is-here/)

### Inferences
- **Best fits for owner-operator trades:** PHCC SD, NHCA SD and BNI. Many BNI chapters reserve one seat per trade category, so plumbers, electricians and handymen are common members.
- **ABC and AGC skew toward larger commercial contractors.** They are less of a fit for solo residential service, but useful for crews of 5-50.

### Gaps
- No information was found on:
  - IEC San Diego, NECA San Diego and ACCA chapter events.
  - BIA San Diego (Building Industry Association).
  - East County / El Cajon or San Diego Regional Chamber member counts.
- No branch counts or locations for Ferguson, Winsupply, Johnstone Supply, or electrical distributors (for example Graybar, CED, Platt) in SD County. Supply-house counter events and "breakfast with vendors" mornings are a known trade outreach channel, but none was sourced for SD.
- No SD Business Journal or Union-Tribune coverage of local AI receptionist adoption was found.
