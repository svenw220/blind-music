#[tauri::command]
pub fn open_link_in_external_browser(link: String, window: tauri::Window) {
  webbrowser::open(&link).ok();
  window.unmaximize().unwrap();
}
