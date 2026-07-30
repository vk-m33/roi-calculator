// Prevents an extra console window from appearing in release mode on Windows
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    roi_calculator_lib::run()
}
