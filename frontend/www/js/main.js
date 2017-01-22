function template(id, data) {
    var cardTemplate = jsrender.templates(document.getElementById(id).innerHTML);
    var html = cardTemplate.render(data);
    return html;
}