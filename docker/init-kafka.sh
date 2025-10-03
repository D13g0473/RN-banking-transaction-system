#!/bin/bash

# Run topic creation in the background
(
  echo "Waiting for Kafka to be ready..."
  until kafka-topics --list --bootstrap-server localhost:9092; do
    echo "Kafka is not ready yet, waiting..."
    sleep 5
  done

  echo "Kafka is ready!"

  # Create topics
  echo "Creating topics..."
  kafka-topics --create --topic txn.commands --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
  kafka-topics --create --topic txn.events --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
  kafka-topics --create --topic txn.dlq --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists

  echo "Topics created successfully."
) &

# Execute the original command for the container to start the Kafka broker
# This is the critical part that was missing.
echo "Starting Kafka broker..."
/etc/confluent/docker/run