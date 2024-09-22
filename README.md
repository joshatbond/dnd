# Dungeons and Dragons Node Graph

A graph visualization of the Dungeons and Dragons 5e node system.

## Inspiration

I was trying to come up with a better way to send character data across the
internet. The way that dndbeyond does it is very inefficient as a big json blob,
with a lot of redundant data. As I was pulling it apart, I realized that what I
was building was a graph. Writing a graph by hand is hot garbage, so I am building
this tool to help me construct that graph. I'm initially focusing on what's in the
character sheet - but this should be easily extendable to other data sources.

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
