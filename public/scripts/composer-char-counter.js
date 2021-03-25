$(document).ready(() => {
  $('textarea#tweet-text').on('input', function() {
    const textAreaLength = $(this).val().length;
    const remainingCharsOutput = $(this).siblings('div').children('.counter');
    
    // update number of characters remaining
    remainingCharsOutput.val(140 - textAreaLength);
    
    // add/remove the 'negative' class to style counter appropriately
    if (140 - textAreaLength < 0) {
      remainingCharsOutput.addClass('negative');
    } else {
      remainingCharsOutput.removeClass('negative');
    }
  });
});
