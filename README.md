# Spin CLI

Spin stands for *Static Page INcubator*. It is a system that allows users to write content in whatever format they want, and then compile that content into html, js, css files. 

This project is a CLI that helps users to:

1. Initialize a new spin project
2. Build the content in a spin project
3. Publish the build content to an online place.
4. Create new documents for your spin distribution.

The actual compilation of of content is performed by so called `archetypes`. The archetypes are published as *OCI Containers*, and gets invoked by the CLI with the source and target volumes mounted so that needed logic can be performed. For archetypes one can look at [the base archetype project](https://github.com/ruffythepirate/spin-archetype-base) which contain useful tools that can be used when constructing archetypes, or the [blog archetype](https://github.com/ruffythepirate/spin-archetype-blog) which is an archetype that can be used to compile blog entries.

## Usage

In the `bin` folder, a couple of node entry points are available for different commands that can be executed. The `bin/spin` command can be used to invoke the other commands, much as is the pattern with the *AWS CLI*. 

Commands to be implemented are:
1. `spin build` - ensures that a `.spin` folder exists in current folder, calls the *blog archetype* with the `src` and `target` folders mounted.
