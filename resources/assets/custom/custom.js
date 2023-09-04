$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

var books = []

var current_book = []
var current_book_name = ''
var current_password = ''
var current_index = 0

function display_books() {
  var books_container = document.getElementById('page-0-books')
  books_container.innerHTML = ''
  for (var i = 0; i < books.length; i++) {
    var book = books[i]
    var book_html = `
      <li onclick="prepare_book('${book}')" class="shadow-none list-group-item list-group-item-dark" data-toggle="tooltip" data-placement="right" title="open book">${book}</li>
    `
    books_container.innerHTML += book_html
  }
}

function get_books() {
  document.getElementById('page-1-password').value = ''
  document.getElementById('page-3-book').value = ''
  document.getElementById('page-3-password').value = ''
  document.getElementById('page-4-page').value = ''
  document.getElementById('page-4-pages').innerHTML = ''

  current_book = []
  current_book_name = ''
  current_password = ''
  current_index = 0

  switch_page('page-2')

  pywebview.api.get_books().then(function (retrieved_books) {
    document.getElementById('title').innerHTML = "dream:book"
    books = retrieved_books
  }).then(function () {
    display_books()
    switch_page('page-0')
  })
}

function prepare_book(name) {
  current_book_name = name
  document.getElementById('page-1-book-name').innerHTML = name
  switch_page('page-1')
}

function switch_page(id) {
  var pages = document.getElementsByClassName('glide-page')
  for (var i = 0; i < pages.length; i++) {
    pages[i].style.display = 'none'
  }
  document.getElementById(id).style.display = 'block'
}

function decrypt_book() {
  current_password = document.getElementById('page-1-password').value
}

function update_create_page() {
  current_book_name = document.getElementById('page-3-book').value
  current_password = document.getElementById('page-3-password').value
  document.getElementById('title').innerHTML = "dream:book - " + current_book_name

  if ((current_book_name.length > 0 && current_password.length > 0) && document.getElementById('page-3-open').classList.contains('bg-info') == false) {
    document.getElementById('page-3-open').classList.add('bg-info')
  } else if ((current_book_name.length == 0 || current_password.length == 0)) {
    document.getElementById('page-3-open').classList.remove('bg-info')
  }
}

function update_password(v) {
  current_password = v

  if (v.length > 0 && document.getElementById('page-1-open').classList.contains('bg-info') == false) {
    document.getElementById('page-1-open').classList.add('bg-info')
  } else if (v.length == 0) {
    document.getElementById('page-1-open').classList.remove('bg-info')
  }
}

function create_book() {
  switch_page('page-2')
  pywebview.api.create_book(current_book_name).then(function () {
    current_book = [""]
    pywebview.api.update_book(current_book_name, current_password, JSON.stringify(current_book))
    current_index = 0
    update_pages()
    switch_page('page-4')
  })
}

function update_pages() {
  var pages = document.getElementById('page-4-pages')

  pages.innerHTML = ''
  for (var i = 0; i < current_book.length; i++) {
    if (i == current_index) {
      var page_html = `
        <li onclick="change_index(${i})" class="shadow-none list-group-item list-group-item-dark active" data-toggle="tooltip" data-placement="right" title="open page">
          ${i}
          <span class="material-icons float-right" onclick="event.stopPropagation(); remove_page(${i})" data-toggle="tooltip" data-placement="right" title="remove page" style="position:absolute;right:6px;top:11px;font-size:16px;">remove_circle</span>
        </li>
      `
    } else {
      var page_html = `
        <li onclick="change_index(${i})" class="shadow-none list-group-item list-group-item-dark transparent" data-toggle="tooltip" data-placement="right" title="open page">
          ${i}
          <span class="material-icons float-right" onclick="event.stopPropagation(); remove_page(${i})" data-toggle="tooltip" data-placement="right" title="remove page" style="position:absolute;right:6px;top:11px;font-size:16px;">remove_circle</span>
        </li>
      `
    }

    pages.innerHTML += page_html
  }
}

function add_page() {
  current_book.push("")
  change_index(current_book.length - 1)
  update_pages()
  document.getElementById('page-4-page').disabled = null
}

function remove_page(i) {
  change_index(i - 1)
  current_book.splice(i, 1)
  update_pages()
}

function change_index(v) {
  current_index = v
  document.getElementById('page-4-page').disabled = null

  if (current_book[v] != undefined) {
    document.getElementById('page-4-page').value = current_book[v]
  } else {
    document.getElementById('page-4-page').value = ''
    document.getElementById('page-4-page').disabled = true
  }

  update_pages()
}  

function update_content(v) {
  current_book[current_index] = v
}

function save_book() {
  pywebview.api.update_book(current_book_name, current_password, JSON.stringify(current_book))
}

function open_book() {
  switch_page('page-2')
  pywebview.api.fetch_book(current_book_name, current_password)
  .then(function (book) {
    if (book == 'invalid password') {
      document.getElementById('error-message').innerHTML = "Incorrect password"
      $('#errorModal').modal('show')
      switch_page('page-1')
    }

    current_book = JSON.parse(book)
    change_index(0)
    update_pages()
    switch_page('page-4')
    document.getElementById('title').innerHTML = "dream:book - " + current_book_name
  })
}

function overwrite_style(theme) {
  if (document.getElementById('theme') != null) {
    document.getElementById('theme').remove()
  }

  var background
  var button_1
  var button_2
  var spinner
  var input_color
  var title_color

  if (theme != 'dark') {
    switch (theme) {
      case 'pastel violet':
        background = '#a0aaff'
        button_1 = '#8287fa'
        button_2 = '#686ef5'
        spinner = '#fff'
        input_color = '#fff'
        title_color = '#fff'
        break;
      case 'pastel blue':
        background = '#a0dfff'
        button_1 = '#82c7fa'
        button_2 = '#68b4f5'
        spinner = '#fff'
        input_color = '#fff'
        title_color = '#fff'
        break;
      case 'rose red':
        background = '#96213b'
        button_1 = '#571322'
        button_2 = '#000'
        spinner = '#000'
        input_color = '#000'
        title_color = '#000'
        break;
      case 'concrete':
        background = '#36393f'
        button_1 = '#2f3136'
        button_2 = '#202225'
        spinner = '#fff'
        input_color = '#fff'
        title_color = '#fff'
        break;
      case 'discord':
        background = '#202225'
        button_1 = '#2f3136'
        button_2 = '#5865f2'
        spinner = '#5865f2'
        input_color = '#fff'
        title_color = '#fff'
        break;
      case 'lipstick':
        background = '#ffacc4'
        button_1 = '#fa92b1'
        button_2 = '#f8608c'
        spinner = '#f8608c'
        input_color = '#000'
        title_color = '#fff'
        break;
      case 'poison':
        background = '#dfbdf7'
        button_1 = '#562d56'
        button_2 = '#321a32'
        spinner = '#562d56'
        input_color = '#562d56'
        title_color = '#562d56'
      default:
        break;
    }
  
    var style = document.createElement('style')
    style.id = 'theme'
    style.innerHTML = `
    .list-group-item-dark { background-color: ${button_2} !important; }
    .bg-dark-2 { background-color: ${background} !important; }
    .bg-dark-3 { background-color: ${button_1} !important; }
    .btn-info { background-color: ${button_2} !important; }
    .bg-info { background-color: ${button_2} !important; }
    .progress-circular-info .progress-circular-left .progress-circular-spinner {
      border-left-color: ${spinner};
    }
    .progress-circular-info .progress-circular-gap, .progress-circular-info .progress-circular-spinner {
      border-top-color: ${spinner};
    }
    .progress-circular-info .progress-circular-right .progress-circular-spinner {
      border-right-color: ${spinner};
    }
    .progress-circular-info .progress-circular-gap, .progress-circular-info .progress-circular-spinner {
      border-top-color: ${spinner};
    }
    input { color: ${input_color} !important; }
    .navbar-dark * { color: ${title_color} !important; }
    `
    document.head.appendChild(style)

    var theme_name = theme.split(' ')
    for (var i = 0; i < theme_name.length; i++) {
      theme_name[i] = theme_name[i].charAt(0).toUpperCase() + theme_name[i].slice(1)
    }
    theme_name = theme_name.join(' ')
    document.getElementById('current-theme').innerHTML = theme_name
    pywebview.api.set_theme(theme)
  }
}

function get_theme() {
  pywebview.api.get_theme().then(function (theme) {
    overwrite_style(theme)
  })
}

window.addEventListener('pywebviewready', function() {
  get_theme()
  get_books()
})