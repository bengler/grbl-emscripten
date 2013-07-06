var line_buffer = "";

LibraryManager.library.console_char = function(value) {
  if (value === 13) {
    console.log(this.line_buffer);
    this.line_buffer = "";
  } else {
    if (typeof this.line_buffer == "undefined") {
      this.line_buffer = ""
    }
    this.line_buffer += String.fromCharCode(value);
  }
};

LibraryManager.library.console_string = function(pointer) {
  while ((value = getValue(pointer, 'i8')) !== 0) {
    _console_char(value);
    pointer += 1;
  }
};