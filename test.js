const text = "{\"code\": \"<img src=\\\"file:///avatar.png\\\" />\"}";
console.log(text.replace(/file:\/\/\/[^\s"'\<)\\]+/g, "https://picsum.photos/200"));
