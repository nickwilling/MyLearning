![1567055057236](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1567055057236.png)

    
      //动态规划，双指针法
    	public int maxArea1(int[] height) {
    	   int maxarea=0,l=0,r=height.length-1;
    	   while(l<r) {
    		   maxarea = Math.max(maxarea, Math.min(height[l], height[r])*(r-l));
    		   if(height[l]<height[r]) l++;
    		   else r--;
    	   }
    
    
    	return maxarea;
    }![1567055129270](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1567055129270.png)
```
  //暴力破解法
  public int maxArea(int[] height) {
	   int maxarea=0;
	   for(int i=0;i<height.length;i++)
		   for(int j=i+1;j<height.length;j++) {
			   maxarea=Math.max(maxarea, Math.min(height[i], height[j])*(j-i));
		   }
        return maxarea;
    }
```

##### 运行时间内存对比：

![1567055266005](C:\Users\wwl\AppData\Roaming\Typora\typora-user-images\1567055266005.png)