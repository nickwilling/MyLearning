import com.sun.source.tree.BinaryTree;

import java.util.ArrayList;
import java.util.LinkedList;
import java.util.Queue;

class BinaryTreeNode {
    char value;
    BinaryTreeNode left;
    BinaryTreeNode right;
    BinaryTreeNode(char value){
        this.value=value;
    }
}


public class binaryTree {
    ArrayList<Character> list = new ArrayList<>();
    private ArrayList<Character> preOrderTraver(BinaryTreeNode t){

        if(t!=null) {
            list.add(t.value);
            preOrderTraver(t.left);
            preOrderTraver(t.right);
        }
        return list;
    }
    private ArrayList<Character> midOrderTraver(BinaryTreeNode t){
        if(t!=null) {
            midOrderTraver(t.left);
            list.add(t.value);
            midOrderTraver(t.right);
        }
        return list;
    }

    private ArrayList<Character> postOrderTraver(BinaryTreeNode t){
        if(t!=null) {
            postOrderTraver(t.left);
            postOrderTraver(t.right);
            list.add(t.value);
        }
        return list;
    }

    private ArrayList<Character> BFS(BinaryTreeNode root){
        ArrayList<Character> lists=new ArrayList<Character>();
        if(root==null)
            return lists;
        Queue<BinaryTreeNode> queue=new LinkedList<BinaryTreeNode>();
        queue.offer(root);
        while (!queue.isEmpty()){
           BinaryTreeNode node = queue.poll();
           if(node.left!=null)
               queue.offer(node.left);
           if(node.right!=null)
               queue.offer(node.right);
           lists.add(node.value);
        }
        return lists;

    }
    public static void main(String[] args) {

        char[] a = {'a','b','c','d','e','f','g','h','i'};
        BinaryTreeNode[] b = new BinaryTreeNode[a.length];
        for (int i = 0;i < a.length; i++){
            b[i] = new BinaryTreeNode(a[i]);
        }

        b[0].left = b[1];
        b[0].right = b[2];
        b[1].left = b[3];
        b[1].right = b[4];
        b[2].left = b[5];
        b[2].right = b[6];
        b[4].left = b[7];
        b[4].right = b[8];

        System.out.println("========This is BFS========");
        for( char x:new binaryTree().BFS(b[0])){
            System.out.println(x);
        }
//        System.out.println("========This is preOrderTraver========");
//        for( char x:new binaryTree().preOrderTraver(b[0])){
//            System.out.println(x);
//        }
//
//        System.out.println("========This is midOrderTraver========");
//        for( char x:new binaryTree().midOrderTraver(b[0])){
//
//            System.out.println(x);
//        }
//
//        System.out.println("========This is PostOrderTraver========");
//        for( char x:new binaryTree().postOrderTraver(b[0])){
//
//            System.out.println(x);
//        }
    }
    public ArrayList<Character> PrintFromTopToBottom(BinaryTreeNode root) {
        ArrayList<Character> list = new ArrayList<>();
        if(root==null) return list;
        Queue<BinaryTreeNode> queue = new LinkedList();
        queue.offer(root);
        while(!queue.isEmpty()){
            BinaryTreeNode node = queue.poll();
            list.add(node.value);
            if(node.left!=null) queue.offer(node.left);
            if(node.right!=null) queue.offer(node.right);
        }
        return list;
    }
}
