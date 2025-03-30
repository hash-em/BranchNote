from markdown import markdown
class tree():
    def __init__(self,head,details=None,details_verbose=None):
        self.head = head
        self.details = details
        self.verbose = details_verbose
        self.children = []

    def addChild(self,head,child,node = None):
        """
        this code does not handle edge case where you provide an invalid head
        if in doubt please use the describe method to know where is possible to insert !

        #### Usage :
        head : name of the branch head \n
        e.g : to add a branch called bar to a branch called foo use addChild(foo,bar)

        """
        if node is None : node = self
        if node.head == head:
            node.children.append(tree(child))
        elif node.children :
            for subnode in node.children:
                if subnode is not None:
                    self.addChild(head,child,subnode)

    def decsribe(self,node=None,previous=""):
        if node is None:
            node = self
        if node.children:
            if node.head != previous :
                print(node.head,"\"",node.details,"\"", end=": ")
            else : print(end=": ")
            for child in node.children:
                print(child.head,"\"",child.details,"\"", end="  ")
                self.decsribe(child,child.head)
            print()

    def addChildren(self,head,*children):
        """
        Include head of the branch as first argument
        And
        """
        for child in children:
            self.addChild(head,child)
            #if child.children : self.addChildren(child.head,child.children) for recusivity maybe
    def maxDepth(self,max_depth=0,node=None,current_level=0,starting_level=0):

        """
        Returns the maximum amount of children a node has within the tree
        specify starting_branch to exlude branch depths before it
        """
        if node is None:
            node = self
        if node.children:
                if current_level >= starting_level : current_max_depth = len(node.children)
                else : current_max_depth = max_depth
                for child in node.children:
                    grandchild_count = self.maxDepth(max_depth,child,current_level+1,starting_level)
                    if grandchild_count > current_max_depth : current_max_depth = grandchild_count
                if current_max_depth >= max_depth : return current_max_depth
        else:
            return max_depth

    def depth(self,node_head:str,node=None):
        if node is None :
            node = self
        if node.head == node_head: return len(node.children)
        elif node.children :
            for child in node.children :
                child_count = self.depth(node_head,child)
                if (child_count) : return child_count

    def addDetails(self,head,details,verbose,node=None):
        if node == None:
            node = self
        if node.head == head :
            node.details = details
            node.verbose = verbose
        else :
            for child in node.children:
                if child.head == head:
                    child.details = details
                    child.verbose = verbose
                elif child.children :
                    self.addDetails(head,details,verbose,child)
    def parentOf(self,child,node=None,level=1,result=None):
        """assuming level 0 is the tree head itself any deeper branching is one deeper level \n
        i.e direct children are level 1 , direct grandchildren are level 2 , etc ..."""
        if node == None: node = self
        if node.children and not (result):
            for subnode in node.children:
                if subnode.head == child :
                    result = (node.head,level)
                    return result
                #elif subnode.children :
                result = self.parentOf(child,subnode,level+1,result)
                if (result) : return result




def markdownTree(file):
    # a tree is made from it's title each level one heading is a direct child
    # details are under header between '==details here=='
    # verbose are until the next '---'
    # any heading less than level one under '---' is considered as subchild
    # level one heading becomes the next level in recursion

    lines:str = file.read()
    title = lines[1:lines.find("\n")].strip()
    new_tree = tree(title)
    details_start =lines.find("==")
    details_end = lines.find("==",details_start+2)
    verbose_end = lines.find("---")
    details,verbose = lines[details_start+2:details_end], lines[details_end+2:verbose_end]
    new_tree.addDetails(title,details,markdown(verbose))
    lines = lines[verbose_end+3:].strip()
    def titleLevel(header):
        count = 0
        while (count < len(header)):
            if header[count] == "#" : count += 1
            else: break
        return count,header[count:]
    def recursiveChildren(lines,new_tree:tree,current_node_head,current_level,next_head):
        if lines == "" : return
        title_level = titleLevel(lines[:lines.find("\n")])
        hashtag_count,title = title_level[0],title_level[1].strip()
        details_start =lines.find("==")
        details_end = lines.find("==",details_start+2)
        child_end = lines.find("---")
        details,verbose = lines[details_start+2:details_end], lines[details_end+2:child_end]
        if hashtag_count == current_level :

            new_tree.addChild(current_node_head,title)
            new_tree.addDetails(title,details,markdown(verbose))
            recursiveChildren(lines[child_end+3:].strip(),new_tree,current_node_head,current_level,title)
        elif hashtag_count > current_level :
            # subheader happened
            new_tree.addChild(next_head,title)
            new_tree.addDetails(title,details,markdown(verbose))
            recursiveChildren(lines[child_end+3:].strip(),new_tree,next_head,hashtag_count,title)
        elif hashtag_count < current_level and hashtag_count > 0 :
            # bigger header happened
            grandparent = new_tree.parentOf(current_node_head)
            previous_head = grandparent[0]
            previous_level = grandparent[1]
            recursiveChildren(lines.strip(),new_tree,previous_head,previous_level,"")
    recursiveChildren(lines,new_tree,title,1,"")
    return new_tree

def test():
    new_tree = tree("title")
    new_tree.addChildren("title","child 1","child 2","child 3","child 4")
    new_tree.addChildren("child 1","grandchild 1","grandchild 2")
    new_tree.addChild("grandchild 1","grand grandchild 1")
    new_tree.addChildren("child 3","foo","bar")
    new_tree.addChild("this is title","child 2")
    print(new_tree.depth("foo"))
test()
