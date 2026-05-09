(function () {
  const escapeHtml = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c]
    );

  async function loadSchedule() {
    const res = await fetch("data/schedule.json");
    return res.json();
  }

  function renderHomeTimeline(milestones, container) {
    const items = milestones.filter((m) => m.featuredOnHome);

    const dotByStatus = {
      past: `<div class="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center border-4 border-background shrink-0">
                   <span class="material-symbols-outlined text-on-primary text-[16px]" style="font-variation-settings: 'FILL' 1;">check</span>
               </div>`,
      current: `<div class="w-8 h-8 rounded-full bg-surface border-2 border-primary-container flex items-center justify-center shrink-0">
                      <div class="w-2.5 h-2.5 rounded-full bg-primary-container"></div>
                  </div>`,
      upcoming: `<div class="w-8 h-8 rounded-full bg-surface border-2 border-outline-variant flex items-center justify-center shrink-0"></div>`,
    };

    const cardClassByStatus = {
      past: "bg-surface border border-outline-variant rounded p-stack-md md:text-center md:mt-4 relative group hover:border-primary transition-colors",
      current:
        "bg-surface border-2 border-primary-container rounded p-stack-md md:text-center md:mt-4 shadow-[0px_4px_20px_rgba(0,51,102,0.05)]",
      upcoming:
        "bg-surface border border-outline-variant rounded p-stack-md md:text-center md:mt-4 opacity-70 group hover:opacity-100 transition-opacity",
    };

    const dateClassByStatus = {
      past: "font-label-md text-label-md text-primary-container block mb-1",
      current: "font-label-md text-label-md text-primary-container block mb-1",
      upcoming: "font-label-md text-label-md text-secondary block mb-1",
    };

    container.innerHTML = `
        <div class="absolute left-[15px] top-4 bottom-4 w-[2px] bg-secondary-container md:hidden"></div>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-stack-lg relative">
            <div class="hidden md:block absolute top-[15px] left-8 right-8 h-[2px] bg-secondary-container z-0"></div>
            ${items
              .map(
                (m) => `
                <div class="relative z-10 flex flex-col gap-4">
                    <div class="absolute -left-[33px] md:static md:w-full flex md:justify-center">
                        ${dotByStatus[m.status] || dotByStatus.upcoming}
                    </div>
                    <div class="${cardClassByStatus[m.status] || cardClassByStatus.upcoming}">
                        <span class="${dateClassByStatus[m.status] || dateClassByStatus.upcoming}">${escapeHtml(m.dateLabel)}</span>
                        <h3 class="font-headline-md text-[18px] text-on-surface font-semibold mb-2">${escapeHtml(m.title)}</h3>
                        <p class="font-body-md text-[14px] text-on-surface-variant">${escapeHtml(m.shortDescription)}</p>
                    </div>
                </div>
            `
              )
              .join("")}
        </div>
    `;
  }

  function dotForStatus(status) {
    const dots = {
      past: `<div class="h-3 w-3 rounded-full bg-primary-container shadow-[0_0_0_4px_#fbf9f8]"></div>`,
      current: `<div class="h-4 w-4 rounded-full border-[3px] border-primary-container bg-surface shadow-[0_0_0_4px_#fbf9f8]"></div>`,
      upcoming: `<div class="h-3 w-3 rounded-full border-2 border-outline bg-surface shadow-[0_0_0_4px_#fbf9f8]"></div>`,
    };
    return dots[status] || dots.upcoming;
  }

  function dateClassForStatus(status) {
    const classes = {
      past: "font-label-md text-label-md text-primary-container uppercase tracking-wider",
      current: "font-label-md text-label-md text-primary uppercase tracking-wider font-bold",
      upcoming: "font-label-md text-label-md text-secondary uppercase tracking-wider",
    };
    return classes[status] || classes.upcoming;
  }

  function renderRegistrationPhasesInline(phases) {
    if (!phases || phases.length === 0) return "";
    const rows = phases
      .map((p) => {
        const isCurrent = p.status === "current";
        const isClosed = p.status === "closed";
        const rowClass = isCurrent
          ? "border-l-4 border-l-primary-container bg-primary-container/5"
          : isClosed
            ? "border-l-4 border-l-outline-variant opacity-70"
            : "border-l-4 border-l-outline-variant";
        const badge = isCurrent
          ? `<span class="inline-block bg-primary-container text-on-tertiary font-label-md text-[10px] uppercase px-2 py-0.5 rounded">Current</span>`
          : isClosed
            ? `<span class="inline-block bg-secondary-container text-primary-container font-label-md text-[10px] uppercase px-2 py-0.5 rounded">Closed</span>`
            : `<span class="inline-block border border-outline-variant text-secondary font-label-md text-[10px] uppercase px-2 py-0.5 rounded">Upcoming</span>`;
        return `
          <div class="${rowClass} pl-stack-sm py-stack-sm flex flex-col gap-1">
            <div class="flex items-center justify-between gap-stack-sm flex-wrap">
              <div class="flex items-center gap-stack-sm flex-wrap">
                <span class="font-headline-md text-[15px] text-primary">${escapeHtml(p.name)}</span>
                <span class="font-label-md text-label-md text-on-surface-variant">${escapeHtml(p.dateRange)}</span>
              </div>
              ${badge}
            </div>
            <p class="font-body-md text-sm text-secondary">${escapeHtml(p.description)}</p>
          </div>
        `;
      })
      .join("");
    return `
      <div class="mt-stack-sm border border-outline-variant rounded p-stack-md bg-surface-container-lowest flex flex-col gap-stack-sm">
        <div class="flex items-center gap-unit">
          <span class="material-symbols-outlined text-secondary text-[18px]">app_registration</span>
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Registration Phases</span>
        </div>
        ${rows}
      </div>
    `;
  }

  function renderFairDayInline(fairDay) {
    if (!fairDay || !fairDay.itinerary) return "";
    const items = fairDay.itinerary;
    const rows = items
      .map((item, i) => {
        const isLast = i === items.length - 1;
        const borderClass = isLast ? "" : "border-b border-outline-variant/50";
        const highlightClass = item.highlighted
          ? "bg-primary-container/5 border-l-4 border-l-primary-container"
          : "border-l-4 border-l-transparent";
        const badgeHtml = item.badge
          ? `<span class="inline-block bg-secondary-container text-on-secondary-container font-label-md text-[11px] px-2 py-0.5 rounded shrink-0">${escapeHtml(item.badge)}</span>`
          : "";
        return `
          <div class="flex flex-col sm:flex-row gap-stack-sm sm:gap-stack-md items-start sm:items-center p-stack-sm ${borderClass} ${highlightClass}">
            <div class="w-24 shrink-0">
              <span class="font-label-md text-label-md text-primary-container">${escapeHtml(item.time)}</span>
            </div>
            <div class="flex flex-col flex-grow">
              <h4 class="font-headline-md text-[15px] text-primary">${escapeHtml(item.title)}</h4>
              <span class="font-body-md text-sm text-secondary">${escapeHtml(item.description)}</span>
            </div>
            ${badgeHtml}
          </div>
        `;
      })
      .join("");
    return `
      <div class="mt-stack-sm border border-outline-variant rounded bg-surface-container-lowest overflow-hidden">
        <div class="flex items-center gap-unit p-stack-md border-b border-outline-variant bg-surface-container-low">
          <span class="material-symbols-outlined text-primary-container text-[18px]">schedule</span>
          <span class="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">${escapeHtml(fairDay.headline)} &middot; ${escapeHtml(fairDay.venue)}</span>
        </div>
        <div class="flex flex-col">${rows}</div>
      </div>
    `;
  }

  function renderDetailedTimeline(data, container) {
    const milestones = data.milestones || [];
    container.innerHTML = milestones
      .map((m) => {
        const wrapperOpacity = m.status === "upcoming" ? "opacity-80" : "";
        const badgeHtml = m.badge
          ? `<span class="inline-block bg-error-container text-on-error-container font-label-md text-[11px] px-2 py-1 rounded w-max mt-1">${escapeHtml(m.badge)}</span>`
          : "";
        let extra = "";
        if (m.id === "registration-opens") {
          extra = renderRegistrationPhasesInline(data.registrationPhases);
        } else if (m.id === "fair-day") {
          extra = renderFairDayInline(data.fairDay);
        }
        return `
          <div class="relative flex items-start group">
            <div class="absolute left-0 -ml-[29px] flex h-5 w-5 items-center justify-center">
              ${dotForStatus(m.status)}
            </div>
            <div class="flex flex-col gap-unit w-full ${wrapperOpacity}">
              <span class="${dateClassForStatus(m.status)}">${escapeHtml(m.dateLabel)}</span>
              <h3 class="font-headline-md text-[18px] text-primary">${escapeHtml(m.title)}</h3>
              ${badgeHtml}
              <p class="font-body-md text-body-md text-on-surface-variant text-sm">${escapeHtml(m.longDescription)}</p>
              ${extra}
            </div>
          </div>
        `;
      })
      .join("");
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const homeTimeline = document.getElementById("home-timeline");
    const detailedTimeline = document.getElementById("detailed-timeline");

    if (!homeTimeline && !detailedTimeline) return;

    const data = await loadSchedule();

    if (homeTimeline) renderHomeTimeline(data.milestones, homeTimeline);
    if (detailedTimeline) renderDetailedTimeline(data, detailedTimeline);
  });
})();
