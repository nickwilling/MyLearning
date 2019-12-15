//public class Solution {
//    private void QuickSort(int[] arr,int low,int high){
//        //递归出口
//        if(low>high) return;
//        //tempt基准
//        int tempt = arr[low];
//        int i,j,t;
//        i = low;
//        j = high;
//
//        while (i < j){
//            while (i<j && arr[j]>=tempt) j--;
//            while (i<j && arr[i]<=tempt) i++;
//            //将大于基准的i和小于基准的j交换
//            if (i<j) {
//                t = arr[i];
//                arr[i] = arr[j];
//                arr[j] = t;
//            }
//        }
//        //将数组中的基准调换成i、j相等时的元素
//        t = arr[low];
//        arr[low] = arr[i];
//        arr[i] = t;
//        QuickSort(arr,low,i-1);
//        QuickSort(arr,i+1,high);
//    }
//
//    private int BinarySearch(int target,int[] list){
//        int left = 0;
//        int right = list.length-1;
//        //mid就是要返回的序号
//        int mid = 0;
//        while(left < right){
//            mid = (left + right) / 2;
//            if(list[mid]==target) return mid;
//            else if(target>list[mid]){
//                left = mid;
//            }else{
//                right = mid;
//            }
//        }
//        return -1;
//    }
//
//    private int recursiveBinarySearch(int left,int right,int target,int[] list){
//        if (list==null||target>list[right]||target<list[left]||left>right)
//            return -1;
//        int mid = (left + right)/2;
//        if(list[mid] == target)
//        {return mid;}
//        else if(list[mid] > target) {
//            return recursiveBinarySearch(left,mid,target,list);
//        }
//        else {
//            return recursiveBinarySearch(mid,right,target,list);
//        }
//
//    }
//    public int Fibonacci(int n) {
//        int[] result = new int[40];
//        result[0] = 0;
//        result[1] = 1;
//        for(int i = 2;i<=n;i++){
//            result[i] = result[i-1] + result[i-2];
//        }
//        return result[n];
//    }
//
//    public static void main(String[] args) {
////        System.out.println(new Solution().BinarySearch(4,new int[] {1,2,3,4,5}));
////        System.out.println(new Solution().recursiveBinarySearch(0,4,10,null));
//        int[] arr = {10,7,2,4,7,62,3,4,2,1,8,9,19};
//        new Solution().QuickSort(arr, 0, arr.length-1);
//        for (int i = 0; i < arr.length; i++) {
//            System.out.println(arr[i]);
//        }
//
//    }
//}

import java.util.Arrays;

public class Solution {
    public int minNumberInRotateArray(int [] array) {
        Arrays.sort(array);
        return array[0];
    }
}