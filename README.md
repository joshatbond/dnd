# Dungeons and Dragons Node Graph

A graph visualization of the Dungeons and Dragons 5e node system.

## Inspiration

I was trying to come up with a better way to send character data across the
internet. The way that dndbeyond does it is very inefficient as a big json blob
with a lot of redundant data. As I was pulling it apart, I realized that what I
was building was a graph. Writing a graph by hand is hot garbage, so I am building
this tool to help me construct that graph. I'm initially focusing on what's in the
character sheet - but this should be easily extendable to other data sources.

### Showcase of the issues with the dndbeyond json blob

Every ability score each have a value unique to that score, and a unique
reference in the source books, but each score also has modifiers that are not unique to that score.

For example, every ability score could be modified by a species bonus. That species bonus is not unique to that ability score, and is not referenced uniquely for that ability score - but it is included in every
score individually.

What you actually want is something like:

```json
{
  "data": [
    {
      "id": "some_unique_id",
      "name": "strength",
      "shortName": "str",
      "value": 12,
      "source": {
        "id": "some_source_id",
        "url": "some_link_1"
      },
      "modifiers": [
        {
          "id": "some_unique_id_2",
          "value": 2
        }
      ]
    },
    {
      "id": "some_source_id",
      "name": "Player's Handbook",
      "shortName": "PHB"
    },
    {
      "id": "some_unique_id_2",
      "name": "Species Bonus",
      "shortName": "SB",
      "url": "some_link_2"
    }
  ]
}
```

This is a much more condensed version to send across the wire, as the data is _more_ de-duped and the client can rehydrate the pointer IDs
to the other nodes as it needs them. What those pointer IDs actually
represent though is links between the nodes, and those links have
metadata - as evidenced by my "extending" the species bonus identifier
with a `value` property.

Neat.

## Features

- Nodes can be dragged around
- Nodes can be resized
- Nodes can be deleted
- Nodes can be created
- Nodes can be edited
- Nodes can be colored
- Nodes can be labeled
- Nodes can be sized
- Nodes can be connected
- Nodes can be disconnected
