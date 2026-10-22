import React, { useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { rewriteHtmlImages } from '../services/supabaseStorage';

interface Props {
  html: string;
  pageId?: string;
}

export const AuthenticPageRenderer: React.FC<Props> = ({ html, pageId }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const processedHtml = useMemo(() => rewriteHtmlImages(html), [html]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Client-side navigation interceptor
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      if (href.startsWith('/') && !href.startsWith('//')) {
        e.preventDefault();
        navigate(href);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    };
    container.addEventListener('click', handleLinkClick);

    // 2. Prepare reveal elements & IntersectionObserver for reveal animations
    // A. Un-bake pre-rendered data-revealed so authentic CSS animations play
    const sketches = Array.from(container.querySelectorAll<HTMLElement>('.tp-sketch'));
    sketches.forEach((sketch, i) => {
      sketch.removeAttribute('data-revealed');
      sketch.setAttribute('data-armed', 'true');
      sketch.style.setProperty('--d', `${(i % 8) * 75}ms`);
    });

    // Un-bake Happy Families polaroid wall items for authentic bounce & paw pat animations
    const wallItems = Array.from(container.querySelectorAll<HTMLElement>('.tp-wall__item'));
    wallItems.forEach((item, i) => {
      item.removeAttribute('data-revealed');
      item.setAttribute('data-armed', 'true');
      item.style.setProperty('--d', `${(i % 4) * 60}ms`);
    });

    // Un-bake FAQ corkboard notes for authentic spring tilt entrance animation
    const notes = Array.from(container.querySelectorAll<HTMLElement>('.tp-note:not(.tp-note--empty)'));
    notes.forEach((note, i) => {
      note.removeAttribute('data-revealed');
      note.setAttribute('data-armed', 'true');
      note.style.setProperty('--i', `${i}`);
    });

    const sketchbookTitle = container.querySelector<HTMLElement>('.tp-sketchbook__title');
    if (sketchbookTitle) {
      sketchbookTitle.removeAttribute('data-revealed');
      sketchbookTitle.setAttribute('data-armed', 'true');
    }

    // Enable breathing & ear twitching animations on the buddy mascot in header & footer
    const pupBuddies = container.querySelectorAll<HTMLElement>('.pup-buddy[data-live]');
    pupBuddies.forEach((pb) => {
      pb.removeAttribute('data-live');
    });

    const revealElements = container.querySelectorAll<HTMLElement>(
      '[data-reveal="true"], [data-pup-scene="true"], section.tp-scene, .tp-door, .tp-sketch, .tp-wall__item, .tp-note'
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) {
            el.setAttribute('data-revealed', 'true');
            el.setAttribute('data-here', 'true');
            el.setAttribute('data-visited', 'true');
            if (el.classList.contains('tp-sketch') || el.classList.contains('tp-wall__item') || el.classList.contains('tp-note')) {
              observer.unobserve(el);
            }
          } else {
            if (el.tagName.toLowerCase() === 'section') {
              el.setAttribute('data-here', 'false');
            }
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
    );

    revealElements.forEach((el) => observer.observe(el));

    // 2B. Authentic Puppy Filters Controller (.tp-sketchpad)
    const sketchpad = container.querySelector<HTMLElement>('.tp-sketchpad');
    const sketchesList = container.querySelector<HTMLElement>('ul.tp-sketches');
    const countDisplay = container.querySelector<HTMLElement>('.tp-sketchbook p[aria-live="polite"]');
    let cleanupFilters = () => {};

    if (sketchpad && sketchesList) {
      const puppyItems = Array.from(sketchesList.querySelectorAll<HTMLLIElement>(':scope > li'));

      const filterState = {
        where: 'Everywhere',
        breed: 'All',
        gender: 'All',
      };

      const applyFilters = () => {
        let visibleCount = 0;

        puppyItems.forEach((li) => {
          const sketch = li.querySelector<HTMLElement>('.tp-sketch');
          if (!sketch) return;

          const label = (sketch.getAttribute('aria-label') || '').toLowerCase();
          const href = (sketch.getAttribute('href') || '').toLowerCase();
          const isAvailable = label.includes('available');

          // 1. Where filter
          let matchesWhere = true;
          if (filterState.where === 'Korean Teacup') {
            matchesWhere = label.includes('korean') || label.includes('teacup') || href.includes('korean') || href.includes('teacup');
          } else if (filterState.where === 'Imported') {
            matchesWhere = !label.includes('korean') && !href.includes('korean');
          }

          // 2. Breed filter
          let matchesBreed = true;
          if (filterState.breed !== 'All') {
            const b = filterState.breed.toLowerCase();
            matchesBreed = label.includes(b) || href.includes(b);
          }

          // 3. Gender filter
          let matchesGender = true;
          if (filterState.gender === 'Boys') {
            matchesGender = label.includes('boy');
          } else if (filterState.gender === 'Girls') {
            matchesGender = label.includes('girl');
          }

          const isMatch = matchesWhere && matchesBreed && matchesGender;

          if (isMatch) {
            li.style.display = '';
            li.style.opacity = '1';
            li.style.transform = '';
            if (isAvailable) visibleCount++;

            // Re-arm & trigger reveal animation for silky entrance
            sketch.removeAttribute('data-revealed');
            sketch.setAttribute('data-armed', 'true');
            sketch.style.setProperty('--d', `${(visibleCount % 8) * 60}ms`);
            observer.observe(sketch);
          } else {
            li.style.display = 'none';
          }
        });

        if (countDisplay) {
          countDisplay.textContent = `${visibleCount} pupp${visibleCount === 1 ? 'y' : 'ies'} looking for a home`;
        }
      };

      const handleChipClick = (e: MouseEvent) => {
        const chip = (e.target as HTMLElement).closest<HTMLButtonElement>('.tp-sticker-chip');
        if (!chip) return;

        const row = chip.closest('div');
        if (!row) return;

        const labelSpan = row.querySelector('span.font-scrawl');
        const rowType = labelSpan?.textContent?.trim().toLowerCase() || '';
        const chipText = chip.textContent?.trim() || '';

        const rowChips = Array.from(row.querySelectorAll<HTMLButtonElement>('.tp-sticker-chip'));

        if (rowType.includes('where')) {
          rowChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          filterState.where = chipText;
        } else if (rowType.includes('breed')) {
          rowChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
          chip.setAttribute('aria-pressed', 'true');
          filterState.breed = chipText;
        } else if (rowType.includes('boy') || rowType.includes('girl')) {
          const isCurrentlyPressed = chip.getAttribute('aria-pressed') === 'true';
          rowChips.forEach((c) => c.setAttribute('aria-pressed', 'false'));
          if (isCurrentlyPressed) {
            chip.setAttribute('aria-pressed', 'false');
            filterState.gender = 'All';
          } else {
            chip.setAttribute('aria-pressed', 'true');
            filterState.gender = chipText;
          }
        }

        applyFilters();
      };

      sketchpad.addEventListener('click', handleChipClick);
      cleanupFilters = () => {
        sketchpad.removeEventListener('click', handleChipClick);
      };
    }

    // 2C. Authentic Happy Families Photo Viewer Lightbox (<dialog aria-label="Photo viewer">)
    const wall = container.querySelector<HTMLElement>('.tp-wall');
    let existingDialog = container.querySelector<HTMLDialogElement>('dialog[aria-label="Photo viewer"]');
    let cleanupViewer = () => {};

    if (wall) {
      if (!existingDialog) {
        existingDialog = document.createElement('dialog');
        existingDialog.setAttribute('aria-label', 'Photo viewer');
        existingDialog.className = 'm-0 h-dvh max-h-none w-screen max-w-none bg-cocoa/95 p-0 text-milk backdrop:bg-cocoa/70';
        existingDialog.setAttribute('data-lenis-prevent', 'true');
        container.appendChild(existingDialog);
      }
      const dialog = existingDialog;

      const prints = Array.from(wall.querySelectorAll<HTMLButtonElement>('.tp-wall__print'));
      let currentIndex = -1;

      const renderViewer = (index: number) => {
        if (index < 0 || index >= prints.length) return;
        currentIndex = index;

        const print = prints[index];
        const img = print.querySelector<HTMLImageElement>('.tp-polaroid__photo img');
        const captionEl = print.querySelector<HTMLElement>('.tp-polaroid__caption');
        const imgSrc = img?.getAttribute('src') || '';
        const imgAlt = img?.getAttribute('alt') || 'TeddyPups Happy Family';
        const caption = captionEl?.textContent?.trim() || '';

        dialog.innerHTML = `
          <div class="flex h-full flex-col justify-between p-4 md:p-6" style="background: rgba(42, 23, 14, 0.96); width: 100vw; height: 100dvh;">
            <div class="flex items-center justify-between gap-4 px-3 py-2 border-b border-milk/10">
              <p class="font-scrawl text-lg md:text-2xl text-milk font-semibold">
                ${index + 1} / ${prints.length} ${caption ? `<span class="opacity-90 font-normal"> — ${caption}</span>` : ''}
              </p>
              <button type="button" class="tp-viewer-close h-10 md:h-11 rounded-full bg-[#fbe3b4] hover:bg-[#f7c66b] px-6 font-bold text-[#2a170e] transition-all cursor-pointer shadow-md">
                Close ✕
              </button>
            </div>
            <div class="relative flex-1 flex items-center justify-center p-4 overflow-hidden">
              <img src="${imgSrc}" alt="${imgAlt}" class="max-h-[72vh] max-w-[90vw] object-contain rounded-lg shadow-2xl transition-all duration-300" />
            </div>
            <div class="flex justify-center items-center gap-4 py-3 border-t border-milk/10">
              <button type="button" class="tp-viewer-prev h-11 md:h-12 rounded-full border-2 border-milk text-milk hover:bg-milk/15 px-7 font-bold transition-all cursor-pointer">
                ← Previous
              </button>
              <button type="button" class="tp-viewer-next h-11 md:h-12 rounded-full bg-[#c2622b] hover:bg-[#a24a1a] text-milk px-8 font-bold transition-all cursor-pointer shadow-md">
                Next →
              </button>
            </div>
          </div>
        `;

        const closeBtn = dialog.querySelector('.tp-viewer-close');
        const prevBtn = dialog.querySelector('.tp-viewer-prev');
        const nextBtn = dialog.querySelector('.tp-viewer-next');

        closeBtn?.addEventListener('click', () => {
          if (typeof dialog.close === 'function') dialog.close();
          else dialog.removeAttribute('open');
        });

        prevBtn?.addEventListener('click', () => {
          const prevIdx = (currentIndex - 1 + prints.length) % prints.length;
          renderViewer(prevIdx);
        });

        nextBtn?.addEventListener('click', () => {
          const nextIdx = (currentIndex + 1) % prints.length;
          renderViewer(nextIdx);
        });
      };

      const handlePrintClick = (e: MouseEvent) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.tp-wall__print');
        if (!btn) return;
        const idx = prints.indexOf(btn);
        if (idx !== -1) {
          renderViewer(idx);
          if (typeof dialog.showModal === 'function') {
            dialog.showModal();
          } else {
            dialog.setAttribute('open', 'true');
          }
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        if (!dialog.open) return;
        if (e.key === 'Escape') {
          dialog.close();
        } else if (e.key === 'ArrowLeft') {
          const prevIdx = (currentIndex - 1 + prints.length) % prints.length;
          renderViewer(prevIdx);
        } else if (e.key === 'ArrowRight') {
          const nextIdx = (currentIndex + 1) % prints.length;
          renderViewer(nextIdx);
        }
      };

      const handleBackdropClick = (e: MouseEvent) => {
        if (e.target === dialog) {
          if (typeof dialog.close === 'function') dialog.close();
          else dialog.removeAttribute('open');
        }
      };

      wall.addEventListener('click', handlePrintClick);
      window.addEventListener('keydown', handleKeyDown);
      dialog.addEventListener('click', handleBackdropClick);

      cleanupViewer = () => {
        wall.removeEventListener('click', handlePrintClick);
        window.removeEventListener('keydown', handleKeyDown);
        dialog.removeEventListener('click', handleBackdropClick);
      };
    }

    // 2D. Authentic How It Works Switch Controller (.tp-switch & tab panels)
    const switchEl = container.querySelector<HTMLElement>('.tp-switch');
    const tabLocal = container.querySelector<HTMLButtonElement>('#tab-local');
    const tabImported = container.querySelector<HTMLButtonElement>('#tab-imported');
    const panelLocal = container.querySelector<HTMLElement>('#panel-local');
    const panelImported = container.querySelector<HTMLElement>('#panel-imported');
    let cleanupSwitch = () => {};

    if (switchEl && tabLocal && tabImported && panelLocal && panelImported) {
      const setTab = (isImported: boolean) => {
        if (isImported) {
          switchEl.style.setProperty('--at', '1');
          tabLocal.setAttribute('aria-selected', 'false');
          tabLocal.tabIndex = -1;
          tabImported.setAttribute('aria-selected', 'true');
          tabImported.tabIndex = 0;
          panelLocal.hidden = true;
          panelImported.hidden = false;

          // Re-arm & animate steps in imported panel
          const steps = Array.from(panelImported.querySelectorAll<HTMLElement>('.tp-step'));
          steps.forEach((st, idx) => {
            st.style.animation = 'none';
            void st.offsetWidth;
            st.style.animation = `tp-step-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 90}ms both`;
          });
        } else {
          switchEl.style.setProperty('--at', '0');
          tabLocal.setAttribute('aria-selected', 'true');
          tabLocal.tabIndex = 0;
          tabImported.setAttribute('aria-selected', 'false');
          tabImported.tabIndex = -1;
          panelImported.hidden = true;
          panelLocal.hidden = false;

          // Re-arm & animate steps in local panel
          const steps = Array.from(panelLocal.querySelectorAll<HTMLElement>('.tp-step'));
          steps.forEach((st, idx) => {
            st.style.animation = 'none';
            void st.offsetWidth;
            st.style.animation = `tp-step-in 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${idx * 90}ms both`;
          });
        }
      };

      const onLocalClick = (e: MouseEvent) => {
        e.preventDefault();
        setTab(false);
      };

      const onImportedClick = (e: MouseEvent) => {
        e.preventDefault();
        setTab(true);
      };

      tabLocal.addEventListener('click', onLocalClick);
      tabImported.addEventListener('click', onImportedClick);

      cleanupSwitch = () => {
        tabLocal.removeEventListener('click', onLocalClick);
        tabImported.removeEventListener('click', onImportedClick);
      };
    }

    // 2E. Authentic FAQ Accordion, Search & Filter Controller (.tp-notes)
    const notesSection = container.querySelector<HTMLElement>('.tp-notes');
    let cleanupFaq = () => {};

    if (notesSection) {
      const notesList = notesSection.querySelector<HTMLElement>('.tp-notes__list');
      const searchInput = notesSection.querySelector<HTMLInputElement>('.tp-notes__search input');
      const countDisplay = notesSection.querySelector<HTMLElement>('.tp-notes__count');
      const board = notesSection.querySelector<HTMLElement>('.tp-notes__board');
      const askLink = notesSection.querySelector<HTMLAnchorElement>('a.tp-notes__ask');
      const askHref = askLink?.getAttribute('href') || 'https://wa.me/971541676733?text=Hi%20TeddyPups!%20I%20have%20a%20question.';

      if (notesList) {
        interface FAQNoteItem {
          id: string;
          li: HTMLLIElement;
          btn: HTMLButtonElement;
          answerDiv: HTMLElement;
          qSpan: HTMLElement;
          pEl: HTMLElement;
          questionText: string;
          answerText: string;
        }

        const rawList = Array.from(notesList.querySelectorAll<HTMLLIElement>(':scope > li.tp-note'));
        const items: FAQNoteItem[] = rawList
          .map((li) => {
            const btn = li.querySelector<HTMLButtonElement>('.tp-note__q button');
            const answerDiv = li.querySelector<HTMLElement>('.tp-note__answer');
            const qSpan = btn?.querySelector<HTMLElement>('.font-plush-text');
            const pEl = li.querySelector<HTMLElement>('.tp-note__flap p');
            if (!btn || !answerDiv || !qSpan || !pEl) return null;
            return {
              id: btn.id.replace(/^q-/, ''),
              li,
              btn,
              answerDiv,
              qSpan,
              pEl,
              questionText: qSpan.textContent?.trim() || '',
              answerText: pEl.textContent?.trim() || '',
            };
          })
          .filter((item): item is FAQNoteItem => item !== null);

        let openId: string | null = null;
        let searchQuery = '';

        const escapeHtml = (str: string) =>
          str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');

        const highlightText = (text: string, query: string): string => {
          if (!query) return escapeHtml(text);
          const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const regex = new RegExp(`(${escaped})`, 'gi');
          const parts = text.split(regex);
          return parts
            .map((part, idx) => (idx % 2 === 1 ? `<mark>${escapeHtml(part)}</mark>` : escapeHtml(part)))
            .join('');
        };

        const updateFaqState = () => {
          const trimmed = searchQuery.trim();
          const queryLower = trimmed.toLowerCase();
          const hasSearch = queryLower.length > 0;
          let visibleCount = 0;

          items.forEach((item) => {
            const qMatch = item.questionText.toLowerCase().includes(queryLower);
            const aMatch = item.answerText.toLowerCase().includes(queryLower);
            const isVisible = !hasSearch || qMatch || aMatch;

            if (isVisible) {
              item.li.style.display = '';
              visibleCount++;

              if (item.qSpan) {
                item.qSpan.innerHTML = highlightText(item.questionText, trimmed);
              }
              if (item.pEl) {
                item.pEl.innerHTML = highlightText(item.answerText, trimmed);
              }

              // Accordion state:
              // If searching and answer matches search, OR if clicked open, unfold it!
              const isOpen = openId === item.id || (hasSearch && aMatch);

              if (isOpen) {
                item.li.setAttribute('data-unfolded', '');
                item.btn.setAttribute('aria-expanded', 'true');
                item.answerDiv.removeAttribute('inert');
              } else {
                item.li.removeAttribute('data-unfolded');
                item.btn.setAttribute('aria-expanded', 'false');
                item.answerDiv.setAttribute('inert', '');
              }
            } else {
              item.li.style.display = 'none';
              item.li.removeAttribute('data-unfolded');
              item.btn.setAttribute('aria-expanded', 'false');
              item.answerDiv.setAttribute('inert', '');
            }
          });

          // Update count display
          if (countDisplay) {
            countDisplay.textContent = hasSearch
              ? `${visibleCount} ${visibleCount === 1 ? 'note' : 'notes'} found`
              : `${items.length} notes on the board`;
          }

          // Update data-open on notesSection so Teddy's bubble flips to '!'
          const anyOpen = openId !== null || hasSearch;
          if (anyOpen) {
            notesSection.setAttribute('data-open', '');
          } else {
            notesSection.removeAttribute('data-open');
          }

          // Empty state handling
          let emptyEl = board?.querySelector<HTMLElement>('.tp-note--empty');
          if (visibleCount === 0) {
            if (!emptyEl && board) {
              emptyEl = document.createElement('div');
              emptyEl.className = 'tp-note tp-note--empty';
              board.appendChild(emptyEl);
            }
            if (emptyEl) {
              emptyEl.innerHTML = `
                <span aria-hidden="true" class="tp-note__pin"></span>
                <p class="font-plush-text text-[1.2rem] font-bold">No note about “${escapeHtml(trimmed)}” yet.</p>
                <p class="mt-2">
                  <a href="${askHref}" target="_blank" rel="noopener noreferrer" class="link-ink">Ask us on WhatsApp</a> and we'll answer.
                </p>
              `;
              emptyEl.style.display = '';
            }
          } else if (emptyEl) {
            emptyEl.style.display = 'none';
          }
        };

        const handleNoteClick = (e: MouseEvent) => {
          const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.tp-note__q button');
          if (!btn) return;
          e.preventDefault();
          const noteId = btn.id.replace(/^q-/, '');
          openId = openId === noteId ? null : noteId;
          updateFaqState();
        };

        const handleSearchInput = (e: Event) => {
          searchQuery = (e.target as HTMLInputElement).value;
          updateFaqState();
        };

        notesList.addEventListener('click', handleNoteClick);
        if (searchInput) {
          searchInput.addEventListener('input', handleSearchInput);
        }

        cleanupFaq = () => {
          notesList.removeEventListener('click', handleNoteClick);
          if (searchInput) {
            searchInput.removeEventListener('input', handleSearchInput);
          }
        };
      }
    }

    // 2F. Authentic Contact Letter Posting Controller (.tp-post)
    const postEl = container.querySelector<HTMLElement>('.tp-post');
    const letterForm = container.querySelector<HTMLFormElement>('form.tp-letterform');
    let cleanupContact = () => {};

    if (postEl && letterForm) {
      let phase: 'writing' | 'sealing' | 'posting' | 'sent' = 'writing';
      let timerIds: number[] = [];

      const nameInput = letterForm.querySelector<HTMLInputElement>('input[name="name"]');
      const phoneInput = letterForm.querySelector<HTMLInputElement>('input[name="phone"]');
      const submitBtn = letterForm.querySelector<HTMLButtonElement>('button[type="submit"]');

      const handleSubmit = (e: SubmitEvent) => {
        e.preventDefault();
        if (phase !== 'writing') return;

        const nameVal = nameInput?.value.trim() || '';
        const phoneVal = phoneInput?.value.trim() || '';

        const errors: string[] = [];
        if (!nameVal || nameVal.length < 2) {
          errors.push('Please tell us your name.');
          nameInput?.setAttribute('aria-invalid', 'true');
        } else {
          nameInput?.removeAttribute('aria-invalid');
        }

        if (!phoneVal || phoneVal.length < 6) {
          errors.push('Please enter a phone or WhatsApp number with country code.');
          phoneInput?.setAttribute('aria-invalid', 'true');
        } else {
          phoneInput?.removeAttribute('aria-invalid');
        }

        let alertEl = letterForm.querySelector<HTMLElement>('.tp-letterform__alert');

        if (errors.length > 0) {
          if (!alertEl) {
            alertEl = document.createElement('div');
            alertEl.setAttribute('role', 'alert');
            alertEl.className = 'tp-letterform__alert';
            const greeting = letterForm.querySelector('.tp-letterform__greeting');
            if (greeting && greeting.nextSibling) {
              letterForm.insertBefore(alertEl, greeting.nextSibling);
            } else {
              letterForm.prepend(alertEl);
            }
          }
          alertEl.innerHTML = `
            <p class="font-semibold">Please check the letter before sending:</p>
            <ul>
              ${errors.map((err) => `<li>${err}</li>`).join('')}
            </ul>
          `;
          const firstInvalid = letterForm.querySelector<HTMLInputElement>('[aria-invalid="true"]');
          firstInvalid?.focus();
          return;
        }

        if (alertEl) {
          alertEl.remove();
        }

        // Valid submission - start authentic sealing and posting animation sequence
        phase = 'sealing';
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.textContent = 'Sealing the envelope…';
        }

        const currentH = postEl.offsetHeight;
        postEl.style.minHeight = `${currentH}px`;
        postEl.setAttribute('data-phase', 'sealing');

        // Add the sealing/posting SVG scene
        let sceneEl = postEl.querySelector<HTMLElement>('.tp-post__scene');
        if (!sceneEl) {
          sceneEl = document.createElement('div');
          sceneEl.setAttribute('aria-hidden', 'true');
          sceneEl.className = 'tp-post__scene';
          sceneEl.innerHTML = `
            <svg viewBox="0 0 160 112" class="tp-post__envelope">
              <rect x="4" y="18" width="152" height="90" rx="6" fill="#fffdf8" stroke="#2a170e" stroke-width="4"></rect>
              <path d="M6 104 64 62M154 104 96 62" fill="none" stroke="#2a170e" stroke-width="3" stroke-linecap="round"></path>
              <path class="tp-post__flap" d="M6 22 80 74 154 22" fill="#fbe3b4" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path>
              <circle cx="80" cy="72" r="11" fill="#a24a1a" stroke="#2a170e" stroke-width="3"></circle>
            </svg>
            <svg viewBox="0 0 200 260" class="tp-post__box">
              <rect x="86" y="170" width="28" height="86" fill="#5a3a28" stroke="#2a170e" stroke-width="4"></rect>
              <path d="M30 70a70 54 0 0 1 140 0v104H30z" fill="#c2622b" stroke="#2a170e" stroke-width="5" stroke-linejoin="round"></path>
              <rect x="58" y="86" width="84" height="14" rx="7" fill="#2a170e"></rect>
              <path d="M44 128h112" stroke="#2a170e" stroke-width="3" stroke-linecap="round" opacity=".35"></path>
              <g class="tp-post__flag">
                <path d="M170 120V64" stroke="#2a170e" stroke-width="5" stroke-linecap="round"></path>
                <path d="M170 64h22v16h-22" fill="#f2be6b" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path>
              </g>
            </svg>
          `;
          postEl.appendChild(sceneEl);
        }

        const t1 = window.setTimeout(() => {
          phase = 'posting';
          postEl.setAttribute('data-phase', 'posting');
        }, 750);

        const t2 = window.setTimeout(() => {
          phase = 'sent';
          postEl.style.minHeight = '';
          postEl.setAttribute('data-phase', 'sent');
          letterForm.style.display = 'none';
          sceneEl?.remove();

          const sentEl = document.createElement('div');
          sentEl.tabIndex = -1;
          sentEl.setAttribute('role', 'status');
          sentEl.className = 'tp-post__sent';
          sentEl.innerHTML = `
            <svg viewBox="0 0 200 150" aria-hidden="true" class="tp-post__box tp-post__box--sent">
              <rect x="86" y="96" width="28" height="52" fill="#5a3a28" stroke="#2a170e" stroke-width="4"></rect>
              <path d="M30 50a70 44 0 0 1 140 0v52H30z" fill="#c2622b" stroke="#2a170e" stroke-width="5" stroke-linejoin="round"></path>
              <rect x="58" y="58" width="84" height="12" rx="6" fill="#2a170e"></rect>
              <path d="M170 92V22" stroke="#2a170e" stroke-width="5" stroke-linecap="round"></path>
              <path d="M170 22h22v16h-22" fill="#f2be6b" stroke="#2a170e" stroke-width="4" stroke-linejoin="round"></path>
            </svg>
            <p class="font-plush mt-4 text-[2rem] font-bold">Your letter is in the post!</p>
            <p class="mx-auto mt-2 max-w-[40ch] text-cocoa-soft text-base leading-relaxed">
              We'll read it with care and get back to you shortly. For a faster chat, our team is always on WhatsApp.
            </p>
            <a href="https://wa.me/971541676733?text=Hi%20TeddyPups!%20I'd%20love%20to%20know%20more%20about%20your%20puppies." target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp mt-6 inline-flex">
              WhatsApp us
            </a>
          `;
          postEl.appendChild(sentEl);
          sentEl.focus({ preventScroll: true });

          // Happy mascot reaction
          const buddy = postEl.parentElement?.querySelector<HTMLElement>('.pup-buddy');
          if (buddy) {
            buddy.setAttribute('data-playing', 'true');
          }
        }, 1750);

        timerIds.push(t1, t2);
      };

      letterForm.addEventListener('submit', handleSubmit);

      cleanupContact = () => {
        letterForm.removeEventListener('submit', handleSubmit);
        timerIds.forEach(clearTimeout);
      };
    }

    // 3. Autoplay & interaction for video (Scene 4)
    const videos = container.querySelectorAll<HTMLVideoElement>('video');
    videos.forEach((video) => {
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.play().catch(() => {});
      video.addEventListener('click', () => {
        if (video.paused) video.play();
        else video.pause();
      });
    });

    // 4. Authentic Meet the pups treadmill scroll controller (Scene 2)
    const meetSection = container.querySelector<HTMLElement>('section.tp-meet');
    let cleanupMeet = () => {};

    if (meetSection) {
      const pinRange = meetSection.querySelector<HTMLElement>('[data-pin-range="true"]');
      const stage = meetSection.querySelector<HTMLElement>('.tp-meet__stage');
      const hall = meetSection.querySelector<HTMLElement>('.tp-meet__hall');
      const track = meetSection.querySelector<HTMLElement>('.tp-meet__track');
      const head = meetSection.querySelector<HTMLElement>('.tp-meet__head');
      const floor = meetSection.querySelector<HTMLElement>('.tp-meet__floor');
      const doors = Array.from(meetSection.querySelectorAll<HTMLElement>('.tp-door'));

      if (pinRange && stage && hall && track) {
        let animId = 0;
        let isPinned = false;
        let maxScroll = 0;
        let springProgress = 0;
        let springVelocity = 0;
        let lastTime = performance.now();

        const measure = () => {
          const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          isPinned = isDesktop && !reducedMotion;

          if (isPinned) {
            meetSection.dataset.pinned = 'true';
            const plateH = Math.max(
              64,
              ...Array.from(track.querySelectorAll<HTMLElement>('.tp-door__plate')).map((e) => e.offsetHeight)
            );
            const floorH = floor?.offsetHeight || 0;
            const headH = head ? head.offsetTop + head.offsetHeight : 0;
            const stageH = stage.clientHeight || window.innerHeight;
            const doorW = Math.max(
              128,
              Math.min(256, 0.15 * window.innerWidth, (stageH - headH - floorH - plateH - 40) / 1.3)
            );
            hall.style.setProperty('--door-w', `${doorW.toFixed(0)}px`);

            // Authentic track overflow from chunk 1wa3jfz4v5w2v.js
            maxScroll = Math.max(0, track.scrollWidth - window.innerWidth);
            const pinHeight = window.innerHeight + Math.round(0.8 * maxScroll);
            pinRange.style.height = `${pinHeight}px`;
            pinRange.style.setProperty('--pinned', '1');
            window.dispatchEvent(new CustomEvent('pup:measure'));
          } else {
            delete meetSection.dataset.pinned;
            hall.style.removeProperty('--door-w');
            hall.style.removeProperty('--floor-x');
            pinRange.style.removeProperty('height');
            pinRange.style.removeProperty('--pinned');
            track.style.removeProperty('transform');
            doors.forEach((door) => {
              door.dataset.open = 'true';
            });
            window.dispatchEvent(new CustomEvent('pup:measure'));
          }
        };

        let currentX = 0;

        const updatePhysics = () => {
          if (!isPinned) {
            animId = requestAnimationFrame(updatePhysics);
            return;
          }

          const pinRect = pinRange.getBoundingClientRect();
          const scrollDistance = pinRange.offsetHeight - window.innerHeight;
          let progress = 0;
          if (scrollDistance > 0) {
            progress = Math.min(1, Math.max(0, -pinRect.top / scrollDistance));
          }

          currentX = -progress * maxScroll;
          track.style.transform = `translate3d(${currentX.toFixed(2)}px, 0, 0)`;
          hall.style.setProperty('--floor-x', `${currentX.toFixed(1)}px`);

          const openThreshold = 0.36 * window.innerWidth;
          doors.forEach((door) => {
            if (door.classList.contains('tp-door--all')) {
              door.dataset.open = 'true';
              return;
            }
            const shouldOpen = door.offsetLeft + currentX < openThreshold;
            const isCurrentlyOpen = door.dataset.open === 'true';
            if (shouldOpen !== isCurrentlyOpen) {
              door.dataset.open = String(shouldOpen);
              if (shouldOpen) {
                window.dispatchEvent(new CustomEvent('pup:cue', { detail: { look: door, secs: 0.9 } }));
              }
            }
          });

          animId = requestAnimationFrame(updatePhysics);
        };

        measure();
        animId = requestAnimationFrame(updatePhysics);

        const resizeObserver = new ResizeObserver(() => measure());
        resizeObserver.observe(track);
        resizeObserver.observe(stage);
        window.addEventListener('resize', measure);

        cleanupMeet = () => {
          cancelAnimationFrame(animId);
          resizeObserver.disconnect();
          window.removeEventListener('resize', measure);
        };
      }
    }

    // 5. Interactive Door in Scene 8 (Home)
    const houseDoor = container.querySelector<HTMLElement>('.tp-house__door');
    const onDoorClick = () => {
      if (houseDoor) {
        const isOpen = houseDoor.style.transform.includes('-65deg');
        houseDoor.style.transform = isOpen ? 'rotateY(0deg)' : 'rotateY(-65deg)';
        houseDoor.style.transition = 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)';
      }
    };
    if (houseDoor) {
      houseDoor.style.cursor = 'pointer';
      houseDoor.addEventListener('click', onDoorClick);
    }

    // 6. Accordions
    const details = container.querySelectorAll<HTMLDetailsElement>('details');
    details.forEach((dt) => {
      dt.addEventListener('toggle', () => {
        if (dt.open) {
          details.forEach((other) => {
            if (other !== dt) other.open = false;
          });
        }
      });
    });

    // 7. Airplane Flight Animation (Paths section: Korea to Dubai)
    const flightEl = container.querySelector<HTMLElement>('.tp-flight');
    let cleanupFlight = () => {};
    if (flightEl) {
      const route = flightEl.querySelector<SVGPathElement>('.tp-flight__route');
      const plane = flightEl.querySelector<SVGGElement>('svg > g');
      const portholeImg = flightEl.querySelector<SVGImageElement>('image');
      if (portholeImg && (!portholeImg.getAttribute('href') || portholeImg.getAttribute('href')?.includes('_next/image'))) {
        portholeImg.setAttribute('href', '/images/home_asset_f17f92d000.webp');
      }

      if (route && plane) {
        const updateFlight = () => {
          const rect = flightEl.getBoundingClientRect();
          const winH = window.innerHeight;
          // Target offset ["start 95%", "end 25%"]
          const startPoint = 0.95 * winH;
          const endPoint = 0.25 * winH;
          const totalDistance = (startPoint - endPoint) + rect.height;
          const currentDistance = startPoint - rect.top;
          const progress = totalDistance > 0 ? Math.min(1, Math.max(0, currentDistance / totalDistance)) : 0;

          const pathLength = route.getTotalLength();
          const currentLength = Math.min(pathLength, Math.max(0, progress * pathLength));
          const pt = route.getPointAtLength(currentLength);
          const ptNext = route.getPointAtLength(Math.min(pathLength, currentLength + 1));
          const ptPrev = route.getPointAtLength(Math.max(0, currentLength - 1));
          const angle = (180 * Math.atan2(ptNext.y - ptPrev.y, ptNext.x - ptPrev.x)) / Math.PI;

          plane.setAttribute(
            'transform',
            `translate(${pt.x.toFixed(1)} ${pt.y.toFixed(1)}) rotate(${angle.toFixed(1)})`
          );

          // Fade in smoothly as it leaves Korea
          const opacity = Math.min(1, Math.max(0, (progress - 0.11) / 0.06));
          plane.style.opacity = String(opacity);
        };

        updateFlight();
        window.addEventListener('scroll', updateFlight, { passive: true });
        window.addEventListener('resize', updateFlight);

        cleanupFlight = () => {
          window.removeEventListener('scroll', updateFlight);
          window.removeEventListener('resize', updateFlight);
        };
      }
    }

    // 8. WhatsApp Phone Interactive Scroll Journey (Scene 4 / tp-chat)
    const chatSection = container.querySelector<HTMLElement>('.tp-chat');
    let cleanupChat = () => {};
    if (chatSection) {
      const stepsList = chatSection.querySelector<HTMLOListElement>('.tp-chat__steps');
      const steps = stepsList ? (Array.from(stepsList.children) as HTMLElement[]) : [];
      const phoneStatus = chatSection.querySelector<HTMLElement>('.tp-phone__status');
      const typingIndicator = chatSection.querySelector<HTMLElement>('.tp-typing');
      const msgGroups = Array.from(chatSection.querySelectorAll<HTMLElement>('.tp-msg-group'));
      const video = chatSection.querySelector<HTMLVideoElement>('.tp-clip video');
      const playBtn = chatSection.querySelector<HTMLButtonElement>('.tp-clip__play');

      if (video) {
        video.poster = '/images/home_asset_7cf800b93c.webp';
      }

      if (playBtn && video) {
        const togglePlay = () => {
          if (video.paused) {
            video
              .play()
              .then(() => {
                playBtn.setAttribute('aria-pressed', 'true');
                playBtn.setAttribute('aria-label', 'Pause video');
                playBtn.innerHTML =
                  '<svg viewBox="0 0 24 24" aria-hidden="true" style="width: 1.3rem; fill: currentColor;"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>';
              })
              .catch(() => {});
          } else {
            video.pause();
            playBtn.setAttribute('aria-pressed', 'false');
            playBtn.setAttribute('aria-label', 'Play video');
            playBtn.innerHTML =
              '<svg viewBox="0 0 24 24" aria-hidden="true" style="width: 1.3rem; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
          }
        };

        const onVideoEnded = () => {
          playBtn.setAttribute('aria-pressed', 'false');
          playBtn.setAttribute('aria-label', 'Play video');
          playBtn.innerHTML =
            '<svg viewBox="0 0 24 24" aria-hidden="true" style="width: 1.3rem; fill: currentColor;"><path d="M8 5v14l11-7z"/></svg>';
        };

        playBtn.addEventListener('click', togglePlay);
        video.addEventListener('ended', onVideoEnded);
      }

      let currentStep = -1;
      let prevStep = -1;
      let typingTimer: ReturnType<typeof setTimeout>;

      const isDesktop = window.matchMedia('(min-width: 1024px)').matches;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isStatic = reducedMotion || !isDesktop;

      const setStepState = (targetStep: number, isTyping: boolean) => {
        steps.forEach((st, idx) => {
          if (idx === targetStep) {
            st.dataset.active = 'true';
            delete st.dataset.done;
          } else if (idx < targetStep) {
            st.dataset.done = 'true';
            delete st.dataset.active;
          } else {
            delete st.dataset.active;
            delete st.dataset.done;
          }
        });

        if (phoneStatus) {
          phoneStatus.textContent = isTyping ? 'typing…' : 'online';
        }

        if (typingIndicator) {
          typingIndicator.dataset.show = isTyping ? 'true' : 'false';
        }

        msgGroups.forEach((grp) => {
          const sIndex = parseInt(grp.dataset.step || '0', 10);
          const shouldShow = isStatic ? true : sIndex < targetStep || (sIndex === targetStep && !isTyping);
          grp.dataset.show = shouldShow ? 'true' : 'false';
        });
      };

      if (isStatic) {
        setStepState(steps.length - 1, false);
      } else {
        setStepState(-1, false);

        const onStepChange = (newStep: number) => {
          if (newStep === currentStep) return;
          const isAdvancing = newStep > prevStep;
          prevStep = newStep;
          currentStep = newStep;

          if (newStep < 0) {
            setStepState(-1, false);
            return;
          }

          if (isAdvancing) {
            clearTimeout(typingTimer);
            setStepState(newStep, true);

            typingTimer = setTimeout(() => {
              setStepState(newStep, false);

              const groupEl = chatSection.querySelector<HTMLElement>(`.tp-msg-group[data-step="${newStep}"]`);
              if (groupEl) {
                const sayText = newStep === 1 ? 'ooh, photos!' : newStep === 2 ? 'home soon!' : undefined;
                window.dispatchEvent(
                  new CustomEvent('pup:cue', {
                    detail: { look: groupEl, secs: 1.4, say: sayText },
                  })
                );
              }
            }, 750);
          } else {
            clearTimeout(typingTimer);
            setStepState(newStep, false);
          }
        };

        const stepObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                const idx = steps.indexOf(entry.target as HTMLElement);
                if (idx !== -1) {
                  onStepChange(idx);
                }
              }
            }
          },
          { rootMargin: '-28% 0px -62% 0px' }
        );

        steps.forEach((st) => stepObserver.observe(st));

        const sectionObserver = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (!entry.isIntersecting && entry.boundingClientRect.top > 0) {
                onStepChange(-1);
              }
            }
          },
          { threshold: 0 }
        );
        sectionObserver.observe(chatSection);

        cleanupChat = () => {
          clearTimeout(typingTimer);
          stepObserver.disconnect();
          sectionObserver.disconnect();
        };
      }
    }

    return () => {
      container.removeEventListener('click', handleLinkClick);
      observer.disconnect();
      cleanupFilters();
      cleanupViewer();
      cleanupSwitch();
      cleanupFaq();
      cleanupContact();
      cleanupMeet();
      cleanupFlight();
      cleanupChat();
      if (houseDoor) {
        houseDoor.removeEventListener('click', onDoorClick);
      }
    };
  }, [processedHtml, navigate]);

  return (
    <div
      ref={containerRef}
      id={pageId}
      dangerouslySetInnerHTML={{ __html: processedHtml }}
    />
  );
};
