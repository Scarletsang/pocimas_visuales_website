# Pocima Visual 02 Website

This is a website made exclusively for the art project **Pócima visual 02: Estando aquí no estoy, estoy.** organized by Cristina Maldonado. This is a documentation of my process of designing the website appearance, coding it and mangaging the website.

Official Website: [pocimasvisuales.com](pocimasvisuales.com)

[[_TOC_]]

## Chapter 1: idea

Cristina wants a medium to host her performance installation. An online school, she saids, except it's not just for learning, but also for experiencing, feeling, and understanding one's presence. My job is not to create content, but to imagine the contents and create a suitable structure to hold its volume. (she is making the content while I'm making the website)

She gives me few images and few paragraphs to start with. I saw maps, hand-drawn pictures, words that hinges on her experiences of different people's prescence, a play of word between "present" and "prescence" as a present from someone gives the receiver the giver's aura. May it be love, hatred or sour. Interplay of contents and words, hidden underneath a series of guided videos and exercises is what she wants, I think. 

Therefore each page is represented internally as a node.  
A node can points to the next node or next array of nodes.  
In the audience's view, it will show a linear serie of pages, sometimes you get to choose which next pages you want to arrive at. However, internally, it is a non-linear structure that is more like a map. And it makes sense, she uses a lot of maps to think too.

## Chapter 2: Design

Lines, lines and lines. I initially thought of making the website looks like a postcard or a gift, but the format will requires the audience to learn how to operate on this carrior of content. And so I decided to give the content outmost attention and leave they to be the protagonist. And so the website strips off the unnecessary fanciness of graphics, and left with fonts and lines after the content. Ironically, the emptiness in turn also grant the each lines and words weight, and so portion of space seperated by lines and words are the main focus in the design.

## Chapter 3: Technical Details

To install dependencies, run:

```
bundler install
npm install
```

This website is written in Ruby and runs on the framework *Sinatra*. To start the server, run one of the following depending on the development or production environment:

```
rackup -p <port>
rackup -p <port> -E production
```

Running the server in production will precompile all the html, css, javascripts with couple of ui images into a folder called `/dist`. The index.html is precompiled using haml and the other static files are packed using the rollup javascript library. 

In development, the website is rendered dynamically, for faster development.

### Content Management

The contents are managed using markdown documents. Each document represents one node(page) in the website.

```markdown
./uploads
|-- nodes.yaml   Defines the connections of the nodes
|-- config.yaml  Defines the meta info of the website
|-- markdown/    Contains all the nodes that represents each page in the website.
|-- image/       Contains all the images used inside the nodes
|-- document/    Contains all the pdf or text documents used inside the nodes
```

Currently they are edited manually. In the near future, a program with its corresponding API will be created for managing this markdown content management system. Proper documentation will be written by then.