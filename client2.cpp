#include<iostream>
#include<sys/socket.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<unistd.h>
#include<cstring>
#include<thread>

using namespace std;

void receiveMsg(int socket_fd){
    char buffer[1024];
    while(true){
        ssize_t amtrecv = recv(socket_fd, buffer, sizeof(buffer), 0);
        if(amtrecv<=0){
            cerr<<"Server disconnected or error."<<endl;
            break;
        }
        buffer[amtrecv]='\0';
        cout<<"Server: "<<buffer<<endl;
    }
}

int main(){
    int socket_fd = socket(AF_INET, SOCK_STREAM, 0);
    if(socket_fd<1){
        cerr<<"Socket creation failed"<<endl;
        close(socket_fd);
        return -1;
    }
    char* ip = "127.0.0.1";
    sockaddr_in address;
    address.sin_port = htons(2000);
    address.sin_family=AF_INET;
    if(inet_pton(AF_INET,ip, &address.sin_addr.s_addr)<=0){
        cerr<<"Invalid address"<<endl;
        return -1;
    }
    int result = connect(socket_fd, (struct sockaddr*)&address, sizeof(address));
    if(result==0){
        cout<<"Successful connection"<<endl;
    }
    else{
        cerr<<"Connection failed"<<endl;
        close(socket_fd);
        return -1;
    }
    thread receiver(receiveMsg, socket_fd);
    string msg;
    while(true){
        cout<<"Enter message: ";
        getline(cin, msg);
        if(msg=="exit"){
            break;
        }
        send(socket_fd, msg.c_str(), msg.size(),0);
    }
    receiver.join(); //waits for receiver thread to finish before closing the program
    close(socket_fd);
    return 0;
}