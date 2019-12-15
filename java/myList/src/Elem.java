public class Elem {
    int sum = 0;
    private int add(int n){
        if(n > 0){
            sum = n + add(n-1);
        }
        return  sum;
    }
    public static void main(String[] args) {
        System.out.println(new Elem().add(3));
    }
}