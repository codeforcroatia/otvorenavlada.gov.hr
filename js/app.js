jQuery(function($) {
  var url = 'https://docs.google.com/spreadsheet/ccc?key=1cQNp8emuRpRHkORtPgA-a5a0NSghxgtADlO5JQgp7QY#gid=0';
  var $el = $('.load-status');
  $el.html('<h3>Loading <img src="http://assets.okfn.org/images/icons/ajaxload-circle.gif" /></h3>');
  var tmpl = $('#our-template').html();
  recline.Backend.GDocs.fetch({url: url})
    .done(function(results) {
      // take off first row as it is instructions
      results.records = results.records.slice(1);
      results.records = _.map(results.records, function(record) {
        record.owners = parseOwners(record.owners);
        record.noOwner = (record.owners.length === 0)
        record.description = markup(record.description);
        record.notes = markup(record.notes);
        return record
      });
      var out = Mustache.render(tmpl, results);
      $el.html(out);
    });
  $('.source-url').attr('href', url);
  $('.js-more-info').live('click', function(e) {
    e.preventDefault();
    $(e.target) .closest('.record').find('.more-info').toggle();
  });
    $('.source-url').attr('href', url);
    $('.js-more-info-report').live('click', function(e) {
    e.preventDefault();
    $(e.target) .closest('.record').find('.more-info-report').toggle();
  });
});

function strip(s) {
  return s.replace(/^ */, '').replace(/ *$/, '');
}

function parseOwners(owners) {
  owners = strip(owners);
  if (owners == '') {
    return [];
  }
  var out = _.map(owners.split(','), function(owner) {
    var parts = strip(owner).match(/^([^<]*)(<(.*)>)?/);
    newowner = {
      name: parts[1],
      email: parts[3] || ''
    }
    if (newowner.email) {
      newowner.gravatar = 'http://www.gravatar.com/avatar/' + md5(newowner.email.toLowerCase()) + '?s=40&d=retro';
    }
    return newowner;
  });
  return out;
}

// replace http:// to a string ...
function markup(str) {
  str = str.replace(/(https?:\/\/[^ ]+)/g, '<a href="$1">$1</a>');
  return str;
}
