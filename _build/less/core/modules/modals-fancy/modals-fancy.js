_modules.interact('Modals', function() {

  this.addType('fancy', {
    classAppend: '.is-modal__content',
    classClose: '.is-modal__close',
    tpl: '' + 
      '<div class="is-modal__panel is-modal__panel--fancy" aria-labelledby="<% this.toggleId %>" role="dialog" aria-hidden="true" >' +
        '<button class="is-modal__close"><span>Close</span></button>' + 
        '<div class="is-modal__content" role="document"></div>' + 
      '</div>'
  });

});
