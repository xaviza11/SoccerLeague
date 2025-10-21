mod models;
mod handlers;
mod routes;
mod services;
mod logics;
mod validators;

use actix_web::{App, HttpServer, web};
use routes::init_routes;
use handlers::handle_404;

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    println!("🚀 Simulator running on http://0.0.0.0:4001");

    HttpServer::new(|| {
        App::new()
            .configure(init_routes)
            .default_service(web::route().to(handle_404))
    })
    .bind(("0.0.0.0", 4001))?
    .run()
    .await
}
