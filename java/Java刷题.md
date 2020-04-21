# 1 数组

## 1.1 二维数组查找

### 题目描述

在一个二维数组中（每个一维数组的长度相同），每一行都按照从左到右递增的顺序排序，每一列都按照从上到下递增的顺序排序。请完成一个函数，输入这样的一个二维数组和一个整数，判断数组中是否含有该整数。



#### 注意：数组为空的判断：

```java
System.out.println(new int[][] {{}}.length); //输出1
System.out.println(new int[][] {}.length); //输出0
System.out.println(new int[] {}.length); //输出0
```
#### 思路：从左下角开始查找，向右递增，向上递减

### 代码

```java
 public boolean Find(int target, int [][] array) {
//		  判断二维数组为空
//        1、二维数组首地址是否为空，即array==null；
//        2、二维数组是否为{}，即array.length==0的情况；
//        3、二维数组是否为{{}}，即array.length=1&&array[0].length==0的情况；
        if((array==null||array.length==0)||(array.length==1&&array[0].length==0))
            return false;
        int rows = array.length; //二维数组的行数
        int cols = array[0].length;//二维数组的列数
        if (target > array[rows-1][cols-1] || target < array[0][0])
            return false;
        int r = rows - 1;
        int c = 0;
        while (r >= 0 && c <= cols-1){
            if (array[r][c] == target)
                return true;
            else if (array[r][c] > target)
                r--;
            else
                c++;
        }

        return false;
    }
```
## 1.2 构建乘积数组
### 题目描述
给定一个数组A[0,1,...,n-1],请构建一个数组B[0,1,...,n-1],其中B中的元素B[i]=A[0]*A[1]*...*A[i-1]*A[i+1]*...*A[n-1]。不能使用除法。（注意：规定B[0] = A[1] * A[2] * ... * A[n-1]，B[n-1] = A[0] * A[1] * ... * A[n-2];）
### 解题思路

B[i]=每行1前面的乘积*每行1后面的乘积
使用Forward[]表示前面从上到下的乘积，Backward[]表示后面从下到上的乘积，那么
$$
B[i] = Forward[i] * Backward[n-1-i]，因为每行有个1所以前后两个数加起来=n-1
$$

<img src="https://uploadfiles.nowcoder.com/images/20160829/841505_1472459965615_8640A8F86FB2AB3117629E2456D8C652" style="zoom: 20%;" />

### 代码

```java
public int[] multiply(int[] A) {
    int n = A.length;
    int[] B = new int[n];
    int[] Forward = new int[n];
    int[] Backward = new int[n];
    Forward[0] = 1;
    Backward[0] = 1;
    for (int i=1; i<n; i++){
        Forward[i] = Forward[i-1]*A[i-1];
        Backward[i] = Backward[i-1]*A[n-i];
    }
    for (int i=0; i<n; i++){
        B[i] = Forward[i] * Backward[n-1-i];
    }

    return B;
}
```

# 2 字符串

## 2.1 字符流中第一个不重复的字符

### 题目描述

请实现一个函数用来找出字符流中第一个只出现一次的字符。例如，当从字符流中只读出前两个字符"go"时，第一个只出现一次的字符是"g"。当从该字符流中读出前六个字符“google"时，第一个只出现一次的字符是"l"。
### 解题思路
凡是这种出现一次的题都要新开一个HashMap用来记录每一个字符出现的次数，但是HashMap是无序的，所以还需要一个有序数组ArrayList来存储字符出现的先后顺序，再对其进行遍历，找出第一个出现次数为1次的字符。
### 代码
```java
public Class Solution{
	HashMap<Character,Integer> map = new HashMap<>();
    ArrayList<Character> list= new ArrayList<>();
    //Insert one char from stringstream
    public void Insert(char ch)
    {
        if (!map.containsKey(ch)) {
            map.put(ch,1);
            list.add(ch);
        }
        else map.put(ch,map.get(ch)+1);

    }
    //return the first appearence once char in current stringstream
    public char FirstAppearingOnce()
    {
        for (char c:list){
            if (map.get(c) == 1) return c;
        }
        return '#';
    }

    public static void main(String[] args) {
        String s = "google";
        Solution solution= new Solution();
        for (char c : s.toCharArray()){
            solution.Insert(c);
        }
        System.out.println(solution.FirstAppearingOnce());


    }
```

# 3 链表

## 3.1 链表中环的入口结点

给一个链表，若其中包含环，请找出该链表的环的入口结点，否则，输出null。

### 思路

两个快慢指针从头节点开始走，

### 代码

```java
/*
 public class ListNode {
    int val;
    ListNode next = null;

    ListNode(int val) {
        this.val = val;
    }
}
*/
public class Solution {
     public static void main(String[] args) {
       Solution s = new Solution();
       //定义一个链表
       ListNode p1 = new ListNode(1);
       ListNode p2 = new ListNode(2);
       ListNode p3 = new ListNode(3);
       ListNode p4 = new ListNode(4);
       ListNode p5 = new ListNode(5);
       p1.next = p2;
       p2.next = p3;
       p3.next = p4;
       p4.next = p5;
       p5.next = p3;
       s.EntryNodeOfLoop(p1);
    }

    public ListNode EntryNodeOfLoop(ListNode pHead)
    {
       //定义两个快慢指针
        ListNode slow = pHead;
        ListNode fast = pHead;
        if(pHead == null || pHead.next == null) return  null;
        //找出快慢指针相遇的节点
        do {  //这里一定要是do-while；如果是while的话slow永远等于fast
            slow = slow.next;
            fast = fast.next.next;
            if(fast == null || fast.next == null)
                return null;
        }while (slow != fast);
        //找出环入口并打印第几个节点是环入口
        int count = 1;
        slow = pHead;
        while (slow != fast){ // 因为这里slow已经被重新指向pHead，!=fast所以可以先判断
            slow = slow.next;
            fast = fast.next;
            count ++;
        }
        System.out.println(count);
        //计算环的节点数
        int loopCount = 0;
        do {
            fast = fast.next;
            loopCount ++;
        }while(slow != fast);
        System.out.println(loopCount);
        return slow;
    }
}
```

# 4 树

## 4.1 重建二叉树

输入某二叉树的前序遍历和中序遍历的结果，请重建出该二叉树。假设输入的前序遍历和中序遍历的结果中都不含重复的数字。例如输入前序遍历序列{1,2,4,7,3,5,6,8}和中序遍历序列{4,7,2,1,5,3,8,6}，则重建二叉树并返回。

###  思路

前序遍历的第一个节点肯定是根节点，中序遍历根节点左边的是左子树，右边的是右子树 ，**题干**中说了**不含重复数字**就代表可以通过对中序遍历的结果进行遍历以找出根节点所在的index。找出根节点后根节点的左右子树 **root.left root.right** 就可以通过递归找出（root.left = reConstructBinaryTree()）返回的即是左子树的根节点，也就是根节点的左节点。

### 代码 

```java
public TreeNode reConstructBinaryTree(int [] pre,int [] in) {
        //数组长度为0
        if(pre.length == 0){
            return null;
        }

        int rootVal = pre[0];
        TreeNode root = new TreeNode(rootVal);
        //递归出口
        if(pre.length == 1){
            return root;
        }

        int rootIndex = 0;
        for (int i=0; i<in.length; i++){
            if (in[i] == rootVal){
                rootIndex = i;
                break;
            }
        }

        root.left = reConstructBinaryTree(Arrays.copyOfRange(pre,1,rootIndex+1),Arrays.copyOfRange(in,0,rootIndex));
        root.right = reConstructBinaryTree(Arrays.copyOfRange(pre,rootIndex+1,pre.length),Arrays.copyOfRange(in,rootIndex+1,in.length));

    return root;

    }
```

