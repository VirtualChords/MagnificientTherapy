import jQuery from 'jquery';

export default (function () {
  jQuery('.email-side-toggle').on('click', e => {
    jQuery('.email-app').toggleClass('side-active');
    e.preventDefault();
  });

  jQuery('.email-list-item, .back-to-mailbox').on('click', e => {
    jQuery('.email-content').toggleClass('open');
    e.preventDefault();
  });
}())
