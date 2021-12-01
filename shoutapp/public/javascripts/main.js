$(function () {
  $('.deleteuser').on('click', deleteUser);
  $('.deleteshout').on('click', deleteShout);
});

function deleteUser() {
  event.preventDefault();
  var confirmation = confirm('Are you sure that you want to delete this user?');
  if (confirmation){
    $.ajax({
      type: 'DELETE',
      url: '/user/'+$(this).data('user'),
      success: function () {
        window.location.replace('/users');
      }
    });
  } else {
    return false;
  }
}

function deleteShout() {
  event.preventDefault();
  $.ajax({
    type: 'DELETE',
    url: '/shouts/'+$(this).data('shout-id')+'/'+$(this).data('username'),
    success: function () {
      window.location.replace('/shouts');
    }
  });
}
