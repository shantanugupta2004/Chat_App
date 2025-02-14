#include<iostream>
#include<sys/socket.h>
#include<netinet/in.h>
#include<arpa/inet.h>
#include<unistd.h>
#include<cstring>
#include<thread>
#include<vector>
#include<mutex>
#include<algorithm>

using namespace std;

vector<int> clients; //Hold FDs of all connected clients
mutex client_mutex; //A mutex tp prevent conflicts when multiple threads access it

void handle(int client_fd){
    char buffer[1024];
    while(true){
        ssize_t amtrecv = recv(client_fd, buffer, sizeof(buffer),0);
        if(amtrecv<=0){
            cerr<<"Client disconnected or error."<<endl;
            break;
        }
        buffer[amtrecv] = '\0';
        cout<<"Client: "<<buffer<<endl;
        lock_guard<mutex> lock(client_mutex); //Locks client mutex to ensure safe access to clients vector
        for(int client: clients){
            if(client!=client_fd){
                send(client, buffer, amtrecv, 0); //sends message to each client excluding sender
            }
        }
    }
    close(client_fd);
    {
    lock_guard<mutex> lock(client_mutex);
    clients.erase(remove(clients.begin(), clients.end(), client_fd), clients.end());
    }
}




int main(){
    int server_fd = socket(AF_INET, SOCK_STREAM, 0);
    if(server_fd<1){
        cerr<<"Socket creation failed"<<endl;
        close(server_fd);
        return -1;
    }
    sockaddr_in address;
    address.sin_family = AF_INET;
    address.sin_addr.s_addr = INADDR_ANY;
    address.sin_port = htons(2000);
    int boundres=bind(server_fd, (struct sockaddr*)&address, sizeof(address));
    if(boundres==0){
        cout<<"Server bound successfully"<<endl;
    }
    else{
        cerr<<"Server bind failed"<<endl;
        close(server_fd);
        return -1;
    }
    int listenres = listen(server_fd, 10);
    if(listenres<0){
        cerr<<"Listening failed"<<endl;
        close(server_fd);
        return -1;
    }
    cout<<"Server is listening for connections.."<<endl;
    while(true){
        sockaddr_in client_addr;
        socklen_t addlen = sizeof(client_addr);
        int client_fd = accept(server_fd, (struct sockaddr *)&client_addr, &addlen);
        if (client_fd < 0)
        {
            cerr << "Connection failed" << endl;
            continue;
        }
        cout<<"Client is connected with: "<<client_fd<<endl;
        {
            lock_guard<mutex> lock(client_mutex);
            clients.push_back(client_fd);
        }
        thread client_thread(handle, client_fd);
        client_thread.detach(); //thread runs independently from main program
    }
    shutdown(server_fd, SHUT_RDWR);
    return  0;
}
