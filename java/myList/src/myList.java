import java.util.*;


class ListNode {
    int val;
    ListNode next;

    ListNode(int val) {
        this.val = val;
    }
}
public class myList {

    public boolean duplicate(int numbers[],int length,int [] duplication) {
        if (numbers==null){
            return false;
        }
        HashMap<Integer,Integer> map = new HashMap<>();
        System.out.println(numbers[0]);

        for (int i=0;i<numbers.length;i++){
            if(!map.containsKey(numbers[i])){

                map.put(numbers[i],1);
            }else if(map.get(numbers[i])>=1){
                duplication[0] = numbers[i];
                return true;
            }
        }
        return false;
    }
    ArrayList<Integer> list = new ArrayList<>();
    public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {

        if(listNode!=null){
            printListFromTailToHead(listNode.next);
            list.add(listNode.val);
        }
        return list;
    }
//    public ArrayList<Integer> printListFromTailToHead(ListNode listNode) {
//        Stack<Integer> stack = new Stack<>();
//
//        while(listNode!=null){
//            stack.push(listNode.val);
//            listNode = listNode.next;
//        }
//
//        ArrayList<Integer> list = new ArrayList<>();
//
//        while(!stack.isEmpty()){
//            list.add(stack.pop());
//        }
//
//        return list;
//    }

    public ArrayList<Integer> printListFromHeadToTail(ListNode listNode) {
        Queue<Integer> queue = new LinkedList<>();

        while(listNode!=null){
            queue.add(listNode.val);
            listNode = listNode.next;
        }

        ArrayList<Integer> list = new ArrayList<>();

        while(!queue.isEmpty()){
            list.add(queue.remove());
        }

        return list;
    }


    public static void main(String[] args) {
        ArrayList<Integer> list = new ArrayList();
        String a = "We are happy";
//        System.out.println(a.replace(" ","%20"));
        ListNode l1 = new ListNode(67);
        ListNode l2 = new ListNode(52);
        ListNode l3 = new ListNode(22);
        ListNode l4 = new ListNode(9);
        l1.next=l2;
        l2.next=l3;
        l3.next=l4;
//        for(int y :new myList().printListFromTailToHead(l1)){
//            System.out.println(y);
//        }
        for(int x :new myList().printListFromHeadToTail(l1)){
            System.out.println(x);
        }

//        while(l1!=null){
//            list.add(l1.val);
//            l1 = l1.next;
//        }
//        for(int x: list){
//            System.out.println(x);
//        }

    }
}

