import tensorflow as tf
print(tf.__version__)
# def print_hello():
#     print('hello')
# class Solution:
#     def threeSum(self, nums) :
#         nums.sort()
#         res =[]
#         for i in range(len(nums)):
#             if i == 0 or nums[i] - nums[i-1] > 0:
#                 l = i+1
#                 r = len(nums)-1
#                 while(l<r):
#                     sum = nums[i] + nums[l] + nums[r]
#                     if sum == 0:
#                         res.append([nums[i],nums[l],nums[r]])
#                         l += 1
#                         r -= 1
#                         while l < r and nums[l] - nums[l-1] == 0:
#                             l += 1
#                         while l < r and nums[r] - nums[r+1] == 0:
#                             r -= 1
#                     elif sum > 0:
#                         r -= 1
#                     else:
#                         l += 0
#
#         return res
# S = Solution()
# # print(S.maxArea([2,3,4,5,18,17,6]))
# print(S.threeSum([0,0,0]))
#
