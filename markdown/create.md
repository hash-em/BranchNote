# Creating tree blocks

==Notes that make sense==

# Why ?

Converting notes into bite sized visual elements helps make connections between subjects seem more intuitive and give a clear roadmap to any matter.
This would be very useful in skimming and reviewing notes as it wouldn't require any effort to navigate them and accessing the "visual" image you created.

# How ?

This application doesn't require any effort to use nor does it need anything other than vanilla markdown

and following reasonable structure

# In a nutshell

start your file with a title and then put introductory content then seperate by three dashes<br>
\-\-\-
<br> # then each block is introduced by hashtag (or more)

 # it can contain headers aswell as long as they between the dashes only the first header count's as the title of the block/node
 and has it's content and ends in three dashes<br>
\-\-\-


---

# Structure
==A well made note is a well structured one==
# Guideline
This is how you would be creating notes in a non destructive way (Maintaining full readability as a noram .Md) following the rules for

1. Structuring your notes

2. Structuring individual notes

---

## Full note
==Vanilla markdown==

# About the process
The tree structuring process takes normal markdown files and breaks them down into blocks and subnodes in what's called a 'tree' structure

# Downsides
The truth is when it comes to how the trees are made the design of choice was the following as it allows for the full Md writting experience with only tradeoff being the arbitrary use of the 3 dashes '\-\-\-' since they are used to delimit blocks


---

## blocks
# blocks
==The building blocks==
blocks are the way in which the program interprets you intentions as to how you envision a given subject !
They are made to empower your notes not to limit them and so it allows for different styles of writting so long as it follows the correct structure
---
### Structre
==How to make my node==

# Tree head
The first node **The head** of the tree starts at the beginning of the document and ends with the first occurence of three consecutive dashes '\-\-\-'
# Rest of nodes
Each other node would be *sandwiched* between delimiting dashes on top and bottom
<details>
<summary>
<h5>example.</h5>
</summary>
- - -
<br>
# Node apparent name (in the tree)<br>
==Nodes description==
<br>
Node content
<br>
- - -
</details>

# Node content
While a block placement is determined by it's title level in terms of #'s
anything besides the defining header of the block is considered valid content so you can have a blocks like this :<br>
\### block name
<br>
==block description==<br>
\# A normal title that would not be interpreted as block
content of the block

\# Another normal title

\## As many titles as you want really



---

### Order
==How to add children==
Strucutre is determined by each blocks heading level with head being the begining of the document till the creation the first node
So :
\# parent title 1<br>
-> \## first child -->  \### first child's child...<br>
-> \## second child --> \### second child's child ...<br>
\ parent title 2
...

---


# How to upload
i haven't implement a direct editor as there are plenty but you can drop you files into the markdown folder here or use the javascript code on any html that follows this structure (which is obtained by processing markdowns in tree.py file + jinja template for study.html)

---
