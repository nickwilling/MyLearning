public interface ZList {

    //向表中添加一个元素
    void add(Elem e);

    //删除表中位于position处的元素
    void delete(int position);

    //返回表中位于position处的元素
    void get(Elem e);

    //获取表中元素的数量
    int length();
}