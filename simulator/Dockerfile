# Stage 1: Build with Rust
FROM rust:1.85 AS builder

# Set working directory for all subsequent instructions
WORKDIR /usr/src/app
# Copy all project files, including Cargo.toml, Cargo.lock, and source code
COPY . .

# Compile in release mode
RUN cargo build --release

# Stage 2: Runtime with Arch Linux
FROM archlinux:latest

# Set the working directory for the application's runtime. 
# This is crucial so relative paths (like 'src/data/...') work correctly.
WORKDIR /app

# 1. Copy the compiled binary
COPY --from=builder /usr/src/app/target/release/simulator /app/simulator

# 2. CRITICAL: Copy the source data directory from the builder stage to the final image.
# We copy the 'src/data' structure relative to the new WORKDIR '/app'.
COPY --from=builder /usr/src/app/src/data /app/src/data

# Default command to run the simulator
CMD ["./simulator"]
