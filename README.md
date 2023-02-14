# neogm

Simple OGM for neo4j with a workflow similar to mongoose.

## Currently supported features

- schemas definition
  - nodes:
    - labels
    - properties
      - type
      - mandatory
      - unique
      - default
    - allowed relationships
      - relationship type
      - node ("target") type
      - direction
  - relationships
    - type
    - properties (same as nodes)
- models creation from schemas
- node model:
  - creation
  - toString
  - toObject
  - add relationship (can't implement typesafety on relationships types)
  - save (query)
  - match (query)
  - query (query)
- relationship model:
  - creation
  - toString
  - toObject
