
class tree():
    def __init__(self,head,details=None):
        self.head = head
        self.details = details
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
        Include head of the list as first argument
        And 
        """
        for child in children:
            self.addChild(head,child)

a = tree("e")
a.addChild("e","question")
a.addChild("e","answer")
a.addChildren("question","e^x","f^x")
a.addChildren("answer","hello","this is answer")
a.decsribe()
