// PayPerView Contract for TON Blockchain
// Allows content creators to monetize videos with pay-per-view model

contract PayPerView {
    // Contract state
    owner: Address;
    videoPrice: Int;
    videoHash: String;
    videoTitle: String;
    videoDescription: String;
    totalViews: Int;
    totalRevenue: Int;
    isActive: Bool;
    viewers: Map<Address, Bool>;
    
    // Events
    event VideoPurchased {
        viewer: Address;
        price: Int;
        timestamp: Int;
    }
    
    event RevenueWithdrawn {
        amount: Int;
        timestamp: Int;
    }
    
    event VideoUpdated {
        title: String;
        description: String;
        price: Int;
    }
    
    // Constructor
    init(owner: Address, videoPrice: Int, videoHash: String, videoTitle: String, videoDescription: String) {
        self.owner = owner;
        self.videoPrice = videoPrice;
        self.videoHash = videoHash;
        self.videoTitle = videoTitle;
        self.videoDescription = videoDescription;
        self.totalViews = 0;
        self.totalRevenue = 0;
        self.isActive = true;
        self.viewers = emptyMap();
    }
    
    // Purchase video access
    receive("purchase") {
        let sender: Address = self.sender;
        let amount: Int = self.amount;
        
        // Check if video is active
        require(self.isActive, "Video is not available for purchase");
        
        // Check if user already purchased
        require(!self.viewers.get(sender), "Already purchased this video");
        
        // Check if payment is sufficient
        require(amount >= self.videoPrice, "Insufficient payment");
        
        // Record the purchase
        self.viewers.set(sender, true);
        self.totalViews = self.totalViews + 1;
        self.totalRevenue = self.totalRevenue + self.videoPrice;
        
        // Emit event
        self.emit(VideoPurchased {
            viewer: sender,
            price: self.videoPrice,
            timestamp: self.now()
        });
        
        // Send excess payment back to sender
        let excess: Int = amount - self.videoPrice;
        if (excess > 0) {
            self.send(sender, excess, "excess payment");
        }
    }
    
    // Withdraw revenue (owner only)
    receive("withdraw") {
        let sender: Address = self.sender;
        
        // Check if sender is owner
        require(sender == self.owner, "Only owner can withdraw revenue");
        
        // Check if there's revenue to withdraw
        require(self.totalRevenue > 0, "No revenue to withdraw");
        
        let amount: Int = self.totalRevenue;
        self.totalRevenue = 0;
        
        // Send revenue to owner
        self.send(self.owner, amount, "revenue withdrawal");
        
        // Emit event
        self.emit(RevenueWithdrawn {
            amount: amount,
            timestamp: self.now()
        });
    }
    
    // Update video details (owner only)
    receive("update_video") {
        let sender: Address = self.sender;
        
        // Check if sender is owner
        require(sender == self.owner, "Only owner can update video");
        
        // Parse update data
        let data: Slice = self.body;
        let title: String = data.loadString();
        let description: String = data.loadString();
        let price: Int = data.loadInt();
        
        // Update video details
        self.videoTitle = title;
        self.videoDescription = description;
        self.videoPrice = price;
        
        // Emit event
        self.emit(VideoUpdated {
            title: title,
            description: description,
            price: price
        });
    }
    
    // Toggle video availability (owner only)
    receive("toggle_active") {
        let sender: Address = self.sender;
        
        // Check if sender is owner
        require(sender == self.owner, "Only owner can toggle availability");
        
        self.isActive = !self.isActive;
    }
    
    // Get video information
    get fun getVideoInfo(): VideoInfo {
        return VideoInfo {
            owner: self.owner,
            videoPrice: self.videoPrice,
            videoHash: self.videoHash,
            videoTitle: self.videoTitle,
            videoDescription: self.videoDescription,
            totalViews: self.totalViews,
            totalRevenue: self.totalRevenue,
            isActive: self.isActive
        };
    }
    
    // Check if address has purchased
    get fun hasPurchased(address: Address): Bool {
        return self.viewers.get(address);
    }
    
    // Get total viewers count
    get fun getTotalViewers(): Int {
        return self.viewers.size();
    }
}

// Video information structure
struct VideoInfo {
    owner: Address;
    videoPrice: Int;
    videoHash: String;
    videoTitle: String;
    videoDescription: String;
    totalViews: Int;
    totalRevenue: Int;
    isActive: Bool;
} 