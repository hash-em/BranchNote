
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
            if node.head != previous : print(node.head, end=": ")
            else : print(end=": ")
            for child in node.children:
                print(child.head, end="  ")
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
def test():
    a = tree("e")
    a.addChildren("e","question","trippy")
    a.addChild("e","answer")
    a.addChildren("question","e^x")
    a.addChildren("e^x","x")
    a.addChildren("answer","hello","this is answer")
    a.decsribe()
    print(a.maxDepth(starting_level=1))
