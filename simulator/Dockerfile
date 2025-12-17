# Stage 1: Build with Rust
FROM rust:1.85 AS builder

# Set the working directory for the build stage
WORKDIR /usr/src/app

# Copy all project files, including Cargo.toml, Cargo.lock, and source code
COPY . .

# Compile the Rust project in release mode
RUN cargo build --release

# Stage 2: Runtime using Arch Linux
FROM archlinux:latest

# Set the working directory for the runtime container
WORKDIR /usr/src/app

# Copy the compiled binary from the builder stage
COPY --from=builder /usr/src/app/target/release/simulator /usr/src/app/simulator

# Copy the data directory (JSON files) from the source project to the runtime container
# Keeping the same relative path so the application can find 'src/data/xxx.json'
COPY --from=builder /usr/src/app/src/data /usr/src/app/src/data

# Set the default command to run the simulator
CMD ["./simulator"]
