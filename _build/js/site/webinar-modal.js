import MicroModal from 'micromodal';
import { createElementFromHtml } from '../lib/utils.js';

const modals = document.querySelectorAll('[data-site-modal]');
const wrappers = [];
modals.forEach(setupModal);

// Create a grouping container to grab all modals from content of the page and 
// move to the bottom of the page
const container = document.createElement('div');
container.classList.add('modals');
document.body.appendChild(container);
wrappers.forEach(m => container.appendChild(m));
// Intialize modal handler script
MicroModal.init({ 
  openClass: 'modal--open',
  disableScroll: true
});


function setupModal(modal, index) {
  // Collect Attributes
  const id = modal.id;
  const data = JSON.parse(modal.dataset.siteModal);
  const classes = modal.getAttribute('class') || '';

  // Remove attributes
  modal.removeAttribute('data-site-modal');
  modal.removeAttribute('id');
  modal.removeAttribute('class');

  const template = (id, classes, data) => `
    <div class="modal modal--slide ${ classes }" id="${ id }" aria-hidden="true">
      <div class="modal__overlay" tabindex="-1" data-micromodal-close>
        <div class="modal__container" role="dialog" aria-modal="true" aria-labelledby="${ id }-title">
          <div class="modal__label">
            <strong>${ data.label }</strong>
            <button class="modal__close" aria-label="Close modal" data-micromodal-close></button>
          </div>
          <div class="modal__header">
            <h2 class="modal__title h2" id="${ id }-title">${ data.title }</h2>
          </div>
          <div class="modal__body"></div>
        </div>
      </div>
    </div>`;

  // Create wrapped modal (with repeatable structure), 
  // and insert the original modal content into it
  const markup = template(id, classes, data).trim();
  const wrapper = createElementFromHtml(markup);
  wrapper.querySelector('.modal__body').appendChild(modal);
  wrappers.push(wrapper);
}