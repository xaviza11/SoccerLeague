mod routes;
mod handlers;
mod models;
mod logics;
mod utils;
mod services;
mod validators;
mod tests;

use actix_web::{App, HttpServer, web};
use routes::init_routes;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Simulator running on http://0.0.0.0:4001");

    HttpServer::new(|| {
        App::new()
            .configure(init_routes)
            .default_service(web::route().to(handlers::errors::handle_404::handle_404))
    })
    .bind(("0.0.0.0", 4001))?
    .run()
    .await
}
