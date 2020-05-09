## 链表中倒数第k个结点

输入一个链表，输出该链表中倒数第k个结点。

```JAVA
   public ListNode FindKthToTail(ListNode head,int k) {
   ArrayList<ListNode> list = new ArrayList<>();
        while (head!=null){
        list.add(head);
        head = head.next;
        }
        if (list.size()<k || k==0) return null;
        return list.get(list.size()-k);
    }
```

