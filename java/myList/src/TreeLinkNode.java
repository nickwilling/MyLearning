import java.util.ArrayList;

public class TreeLinkNode {
    int val;
    TreeLinkNode left = null;
    TreeLinkNode right = null;
    TreeLinkNode next = null;

    TreeLinkNode(int val) {
        this.val = val;
    }
    TreeLinkNode(){

    }
    ArrayList<TreeLinkNode> list = new ArrayList<>();
    private void midOrderTraver(TreeLinkNode t){
        if(t!=null) {
            midOrderTraver(t.left);
            list.add(t);
            midOrderTraver(t.right);
        }
    }
    public TreeLinkNode GetNext(TreeLinkNode pNode)
    {
        TreeLinkNode curNode = new TreeLinkNode();
        curNode = pNode;
        while (pNode.next!=null){
            pNode=pNode.next;
        }
        midOrderTraver(pNode);
        for(TreeLinkNode t:list){
            if (t==curNode){
                System.out.println(list.indexOf(t));
                if (list.indexOf(t)==list.size()-1) return null;
                return list.get(list.indexOf(t)+1);
            }
        }
        return pNode;
    }

    public static void main(String[] args) {
        char[] a = {'a','b','c','d','e','f','g','h','i'};
        TreeLinkNode[] b = new TreeLinkNode[a.length];
        for (int i = 0;i < a.length; i++){
            b[i] = new TreeLinkNode(a[i]);
        }

        b[0].left = b[1];
        b[0].right = b[2];
        b[1].left = b[3];
        b[1].right = b[4];
        b[1].next = b[0];
        b[2].left = b[5];
        b[2].right = b[6];
        b[2].next = b[0];
        b[3].next = b[1];
        b[4].left = b[7];
        b[4].right = b[8];
        b[4].next = b[1];
        b[5].next = b[2];
        b[6].next = b[2];
        b[7].next = b[4];
        b[8].next = b[4];
        System.out.println(new TreeLinkNode().GetNext(b[6]).val);
    }
}
