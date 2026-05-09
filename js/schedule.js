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

  function renderMasterTimeline(milestones, container) {
    const dotByStatus = {
      past: `<div class="h-3 w-3 rounded-full bg-primary-container shadow-[0_0_0_4px_#fbf9f8]"></div>`,
      current: `<div class="h-4 w-4 rounded-full border-[3px] border-primary-container bg-surface shadow-[0_0_0_4px_#fbf9f8]"></div>`,
      upcoming: `<div class="h-3 w-3 rounded-full border-2 border-outline bg-surface shadow-[0_0_0_4px_#fbf9f8]"></div>`,
    };

    const dateClassByStatus = {
      past: "font-label-md text-label-md text-primary-container uppercase tracking-wider",
      current: "font-label-md text-label-md text-primary uppercase tracking-wider font-bold",
      upcoming: "font-label-md text-label-md text-secondary uppercase tracking-wider",
    };

    container.innerHTML = milestones
      .map((m) => {
        const wrapperOpacity = m.status === "upcoming" ? "opacity-70" : "";
        const badgeHtml = m.badge
          ? `<span class="inline-block bg-error-container text-on-error-container font-label-md text-[11px] px-2 py-1 rounded w-max mt-1">${escapeHtml(m.badge)}</span>`
          : "";
        const descMargin = m.badge ? "mt-1" : "";
        return `
            <div class="relative flex items-start group">
                <div class="absolute left-0 -ml-[25px] flex h-5 w-5 items-center justify-center">
                    ${dotByStatus[m.status] || dotByStatus.upcoming}
                </div>
                <div class="flex flex-col gap-unit ${wrapperOpacity}">
                    <span class="${dateClassByStatus[m.status] || dateClassByStatus.upcoming}">${escapeHtml(m.dateLabel)}</span>
                    <h3 class="font-headline-md text-[18px] text-primary">${escapeHtml(m.title)}</h3>
                    ${badgeHtml}
                    <p class="font-body-md text-body-md text-on-surface-variant text-sm ${descMargin}">${escapeHtml(m.longDescription)}</p>
                </div>
            </div>
        `;
      })
      .join("");
  }

  function renderRegistrationPhases(phases, container) {
    container.innerHTML = phases
      .map((p) => {
        if (p.status === "current") {
          return `
                <div class="border-[2px] border-primary-container rounded p-stack-md bg-surface-container-lowest flex flex-col gap-unit relative shadow-[0_4px_20px_rgba(0,51,102,0.05)]">
                    <div class="absolute top-0 right-0 bg-primary-container text-on-tertiary font-label-md text-[10px] uppercase px-2 py-1 rounded-bl">Current Phase</div>
                    <div class="flex justify-between items-center w-full pt-1">
                        <span class="font-label-md text-label-md text-on-surface-variant">${escapeHtml(p.name)}</span>
                    </div>
                    <span class="font-headline-md text-[18px] text-primary">${escapeHtml(p.dateRange)}</span>
                    <p class="font-body-md text-sm text-secondary mt-auto pt-stack-sm border-t border-outline-variant/50">${escapeHtml(p.description)}</p>
                </div>
            `;
        }
        const opacityClass = p.status === "upcoming" ? "opacity-80" : "";
        const statusBadge =
          p.status === "closed"
            ? `<span class="font-label-md text-[12px] bg-secondary-container text-primary-container px-2 py-0.5 rounded">Closed</span>`
            : "";
        return `
            <div class="border border-outline-variant rounded p-stack-md bg-surface-container-lowest flex flex-col gap-unit hover:border-primary-container transition-colors ${opacityClass}">
                <div class="flex justify-between items-center w-full">
                    <span class="font-label-md text-label-md text-on-surface-variant">${escapeHtml(p.name)}</span>
                    ${statusBadge}
                </div>
                <span class="font-headline-md text-[18px] text-primary">${escapeHtml(p.dateRange)}</span>
                <p class="font-body-md text-sm text-secondary mt-auto pt-stack-sm border-t border-outline-variant/50">${escapeHtml(p.description)}</p>
            </div>
        `;
      })
      .join("");
  }

  function renderFairDay(fairDay, headerEl, itineraryEl) {
    if (headerEl) {
      headerEl.innerHTML = `${escapeHtml(fairDay.headline)} - ${escapeHtml(fairDay.venue)}`;
    }
    if (itineraryEl) {
      const items = fairDay.itinerary;
      itineraryEl.innerHTML = items
        .map((item, i) => {
          const isLast = i === items.length - 1;
          const baseRow =
            "flex flex-col sm:flex-row hover:bg-surface-container-lowest transition-colors p-stack-md gap-stack-md sm:gap-gutter items-start sm:items-center";
          const borderClass = isLast ? "" : "border-b border-outline-variant/50";
          const highlightClass = item.highlighted
            ? "bg-primary-container/5 border-l-4 border-l-primary-container"
            : "";
          const badgeHtml = item.badge
            ? `<div class="mt-2 sm:mt-0 sm:ml-auto">
                       <span class="inline-block bg-secondary-container text-on-secondary-container font-label-md text-[12px] px-2 py-1 rounded">${escapeHtml(item.badge)}</span>
                   </div>`
            : "";
          return `
                <div class="${baseRow} ${borderClass} ${highlightClass}">
                    <div class="w-32 shrink-0">
                        <span class="font-label-md text-label-md text-primary-container">${escapeHtml(item.time)}</span>
                    </div>
                    <div class="flex flex-col">
                        <h4 class="font-headline-md text-[16px] text-primary">${escapeHtml(item.title)}</h4>
                        <span class="font-body-md text-sm text-secondary">${escapeHtml(item.description)}</span>
                    </div>
                    ${badgeHtml}
                </div>
            `;
        })
        .join("");
    }
  }

  document.addEventListener("DOMContentLoaded", async () => {
    const homeTimeline = document.getElementById("home-timeline");
    const masterTimeline = document.getElementById("master-timeline");
    const registrationPhases = document.getElementById("registration-phases");
    const fairDayHeader = document.getElementById("fair-day-header");
    const fairDayItinerary = document.getElementById("fair-day-itinerary");

    if (!homeTimeline && !masterTimeline && !registrationPhases && !fairDayItinerary) return;

    const data = await loadSchedule();

    if (homeTimeline) renderHomeTimeline(data.milestones, homeTimeline);
    if (masterTimeline) renderMasterTimeline(data.milestones, masterTimeline);
    if (registrationPhases) renderRegistrationPhases(data.registrationPhases, registrationPhases);
    if (fairDayItinerary || fairDayHeader)
      renderFairDay(data.fairDay, fairDayHeader, fairDayItinerary);
  });
})();
