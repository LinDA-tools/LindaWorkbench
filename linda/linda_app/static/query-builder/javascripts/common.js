
function get_server_address() {
  return window.location.protocol + "//" + window.location.host;
};

function show_loading() {
  return $("#loading").show();
};

function hide_loading() {
  return $("#loading").hide();
};

function html_safe(str) {
  if (str !== void 0) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  } else {
    return "";
  }
};

function break_words(str) {
  var i, j, new_word, result, words;
  words = str.split(" ");
  result = "";
  i = 0;
  while (i < words.length) {
    if (words[i].length > 50) {
      new_word = "";
      j = 0;
      while (j < words[i].length) {
        if (j > 0) {
          new_word += "- ";
        }
        new_word += words[i].substring(j, j + 40);
        j = j + 40;
      }
      words[i] = new_word;
    }
    if (i > 0) {
      result += " ";
    }
    result += words[i];
    i++;
  }
  return result;
};

$(document).ready(function() {
  $('.dropdown-toggle').dropdown();
});

function truncate(string, length, o)
{
  if(string.length <= length){
    return string;
  }
  else{
    return string.substring(0,length)+o;
  }
}
String.prototype.splice = function( idx, rem, s ) {
    return (this.slice(0,idx) + s + this.slice(idx + Math.abs(rem)));
};

