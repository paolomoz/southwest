/**
 * booking-widget — southwest.com fare-search hero (replica).
 * Schema: stardust/eds-schema/index.json § hero-booking.
 * Decode tier: TEMPLATE-SLOTTED (#95) — the widget is a fixed-composition
 * facsimile of the live booking application (client-side block; at full build
 * it calls the booking APIs). Authored slots (queried, not indexed — #42):
 *   heading  → promo headline ("The airline with Heart.") — the page <h1>
 *   body     → lede ("Low fares to the U.S.")
 *   CTA      → primary action (Book now)
 * All form chrome (tabs, fields, labels, disclaimers) is fixed template DOM.
 */

const TEMPLATE = `
<div class="widget-card">
  <nav class="product-tabs" aria-label="Booking products">
    <a href="/air/booking/" aria-current="true">Flights<span class="sr-only">Flights</span></a>
    <a href="/vacations/">Vacations<span class="sr-only">Vacations</span></a>
    <a href="https://www.southwesthotels.com/">Hotels<span class="sr-only">Hotels</span></a>
    <a href="/car/booking/"><span class="tab-flag">New!</span>Cars<span class="sr-only">Cars</span></a>
    <a href="https://www.southwestcruises.com/">Cruises<span class="sr-only">Cruises</span></a>
  </nav>
  <form class="widget-body" action="/air/booking/" method="get">
    <div class="widget-meta">
      <span>Now accepting reservations through June 02, 2027.</span>
      <span>*Required fields</span>
    </div>
    <div class="field-row">
      <div class="field"><label for="bw-trip">Trip type</label>
        <select id="bw-trip" name="tripType"><option>Round-trip</option><option>One-way</option></select></div>
      <div class="field"><label for="bw-recent">Recent searches</label>
        <select id="bw-recent" name="recent"><option>Select search</option></select></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="bw-origin">Depart*</label><input id="bw-origin" name="origin" type="text" autocomplete="off"></div>
      <span class="swap-glyph" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M7 4v13M7 4 4 7m3-3 3 3M17 20V7m0 13 3-3m-3 3-3-3"/></svg></span>
      <div class="field"><label for="bw-dest">Arrive*</label><input id="bw-dest" name="dest" type="text" autocomplete="off"></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="bw-dd">Depart date*</label><input id="bw-dd" name="departDate" type="text" value="09/01"><p class="sub-hint">Tue, Sep 01, 2026</p></div>
      <div class="field"><label for="bw-rd">Return date*</label><input id="bw-rd" name="returnDate" type="text" value="09/04"><p class="sub-hint">Fri, Sep 04, 2026</p></div>
      <div class="field"><label for="bw-pax">Passengers*</label><input id="bw-pax" name="passengers" type="text" value="1"></div>
    </div>
    <div class="field-row">
      <div class="field"><label for="bw-promo">Promo code</label><input id="bw-promo" name="promo" type="text"></div>
      <fieldset class="field fares-row">
        <legend class="group-label">Show fares in</legend>
        <label><input type="radio" name="fares" checked> $</label>
        <label><input type="radio" name="fares"> Points</label>
        <label><input type="radio" name="fares"> $ + Points</label>
      </fieldset>
    </div>
    <label class="lfc-row"><input type="checkbox" name="faresPoints"> Show fares in points</label>
    <label class="lfc-row lfc-cal"><input type="checkbox" name="lfc"> Search with low fare calendar</label>
    <button class="button primary search-btn" type="submit">Search flights</button>
    <a class="baggage-link" href="/html/customer-service/travel-fees.html?clk=HOME-BOOKING-WIDGET-BAGGAGE-FEES">Updated checked baggage policies Baggage and optional fees</a>
  </form>
</div>
<div class="hero-copy"></div>
<div class="explorer-strip">
  <p><b>Not sure where to?</b> Explore more by searching for
    <a href="https://www.southwest.com/">Hawaii</a>, <a href="https://www.southwest.com/">Tropical</a>, <a href="https://www.southwest.com/">Mountain/Ski</a>, <a href="https://www.southwest.com/">National Park</a>, <a href="https://www.southwest.com/">New Cities</a>, <a href="https://www.southwest.com/">Popular Cities</a>, or <a href="https://www.southwest.com/">Top Beaches</a>.
    <a href="https://www.southwest.com/route-map/?clk=visrtmap">See everywhere we fly</a></p>
</div>`;

export default async function decorate(block) {
  // collect authored content (query-based, #42/#62)
  const heading = block.querySelector('h1, h2, h3');
  const ps = [...block.querySelectorAll('p')];
  const lede = ps.find((p) => !p.querySelector('a') && p.textContent.trim());
  const ctas = ps.filter((p) => p.querySelector('a'));

  const shell = document.createElement('div');
  shell.className = 'hero-grid';
  shell.innerHTML = TEMPLATE;

  const copy = shell.querySelector('.hero-copy');
  if (heading) {
    const h1 = document.createElement('h1');
    const inner = heading.querySelector('h1, h2, h3') || heading; // #55 unwrap
    [...inner.childNodes].forEach((n) => h1.append(n.cloneNode(true)));
    copy.append(h1);
  }
  if (lede) {
    const p = document.createElement('p');
    p.className = 'lede';
    p.textContent = lede.textContent.trim();
    copy.append(p);
  }
  ctas.forEach((p) => copy.append(p.cloneNode(true)));

  block.replaceChildren(shell);
}
