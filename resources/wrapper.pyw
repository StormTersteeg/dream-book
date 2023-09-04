import webview, os, sys
from Crypto.Cipher import AES
import base64

def on_closed():
  pass

def on_closing():
  pass

def on_shown():
  pass

def on_loaded():
  pass

class Api:
  def minimize(self):
    window.minimize()

  def fullscreen(self):
    window.toggle_fullscreen()

  def close(self):
    window.destroy()
    os._exit(0)

  def reload(self):
    os.startfile(sys.argv[0])
    self.close()

  def encrypt(self, data, key):
    data = bytes(data, 'utf-8')
    key = bytes(self.prepare_key(key), 'utf-8')

    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(data)

    encrypted_lines = [ x for x in (cipher.nonce, tag, ciphertext) ]
    result = base64.b64encode(str(encrypted_lines).encode('utf-8'))
    return result.decode('utf-8')

  def decrypt(self, data, key):
    data = bytes(base64.b64decode(data).decode('utf-8'), 'utf-8')
    key = bytes(self.prepare_key(key), 'utf-8')

    nonce, tag, ciphertext = eval(data)

    cipher = AES.new(key, AES.MODE_EAX, nonce)
    data = cipher.decrypt_and_verify(ciphertext, tag)
    return data.decode('utf-8')

  def prepare_key(self, key):
    while len(key) < 32:
      key += key
    return base64.b64encode(key.encode('utf-8')).decode('utf-8')[0:32]

  def get_books(self):
    # list dir but remove any file that doesn't end with .drm
    books = [f for f in os.listdir() if f.endswith(".drm")]

    for i in range(len(books)):
      books[i] = books[i].replace(".drm", "")

    return books

  def fetch_book(self, book, password):
    with open(book + ".drm", "r") as f:
      try:
        return self.decrypt(f.read(), password)
      except:
        return 'invalid password'

  def create_book(self, book):
    with open(book + ".drm", "w") as f:
      f.write("")

  def update_book(self, book, password, data):
    with open(book + ".drm", "w") as f:
      f.write(self.encrypt(data, password))

  def set_theme(self, theme):
    with open("settings.txt") as f:
      settings = f.read()
      settings = settings.split("\n")
      settings[0] = theme
      settings = "\n".join(settings)
      with open("settings.txt", "w") as f:
        f.write(settings)
  
  def get_theme(self):
    if os.path.exists("settings.txt"):
      with open("settings.txt") as f:
        settings = f.read()
        settings = settings.split("\n")
      return settings[0]
    else:
      with open("settings.txt", "w") as f:
        f.write("dark\n")
      return "dark"

#!FLAG-HTML

if __name__ == '__main__':
  api = Api()
  window = webview.create_window("{settings.app_name}", html=html, js_api=api, width={settings.app_proportions[0]}, height={settings.app_proportions[1]}, confirm_close={settings.app_confirm_close}, frameless={settings.app_frameless}, fullscreen={settings.app_fullscreen}, resizable={settings.app_resizable})
  window.events.closed += on_closed
  window.events.closing += on_closing
  window.events.shown += on_shown
  window.events.loaded += on_loaded
  webview.start(gui="{settings.app_web_engine}", debug={settings.app_allow_inspect})