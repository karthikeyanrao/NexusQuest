
module moon_race::moon_race {
    use sui::balance::{Self, Balance};
    use sui::sui::SUI;
    use sui::coin::{Self, Coin};
    use sui::event;

    // Errors
    const EInsufficientDeposit: u64 = 0;
    const EInsufficientPoints: u64 = 1;
    const EInvalidWithdrawAmount: u64 = 2;

    // Constants
    const POINTS_PER_SUI: u64 = 1000; // 1 SUI = 100 points
    const MIN_DEPOSIT: u64 = 1_000_000; // 0.001 SUI minimum deposit

    /// Struct to store user points and their SUI balance
    public struct UserPoints has key, store {
        id: UID,
        points: u64,
        sui_balance: Balance<SUI>,
        owner: address
    }

    public struct AdminCap has key {
        id: UID
    }

    // Events
    public struct PointsDepositEvent has copy, drop {
        user: address,
        sui_amount: u64,
        points_received: u64
    }

    public struct PointsWithdrawEvent has copy, drop {
        user: address,
        sui_amount: u64,
        points_spent: u64
    }

    /// Create a new UserPoints object
    public entry fun initialize_points(ctx: &mut TxContext) {

        let user_points = UserPoints {
            id: object::new(ctx),
            points: 0,
            sui_balance: balance::zero(),
            owner: tx_context::sender(ctx)
        };
        
        transfer::transfer(user_points, tx_context::sender(ctx));
    }

    /// Deposit SUI to receive points
    public entry fun deposit_for_points(
        user_points: &mut UserPoints,
        payment: Coin<SUI>,
        ctx: &mut TxContext
    ) {
        let deposit_amount = coin::value(&payment);
        assert!(deposit_amount >= MIN_DEPOSIT, EInsufficientDeposit);
        
        // Calculate points to award
        let points_to_add = (deposit_amount * POINTS_PER_SUI) / 1_000_000_000; // Adjust for SUI decimals
        
        // Add SUI to balance
        let payment_balance = coin::into_balance(payment);
        balance::join(&mut user_points.sui_balance, payment_balance);
        
        // Add points
        user_points.points = user_points.points + points_to_add;

        // Emit deposit event
        event::emit(PointsDepositEvent {
            user: tx_context::sender(ctx),
            sui_amount: deposit_amount,
            points_received: points_to_add
        });
    }

    /// Withdraw SUI by spending points
    public entry fun withdraw_sui(
        user_points: &mut UserPoints,
        points_to_spend: u64,
        ctx: &mut TxContext
    ) {
        // Check if user has enough points
        assert!(user_points.points >= points_to_spend, EInsufficientPoints);
        
        // Calculate SUI amount to withdraw (reverse of deposit calculation)
        let sui_to_withdraw = (points_to_spend * 1_000_000_000) / POINTS_PER_SUI;
        
        // Ensure user has enough SUI balance
        assert!(balance::value(&user_points.sui_balance) >= sui_to_withdraw, EInvalidWithdrawAmount);
        
        // Deduct points
        user_points.points = user_points.points - points_to_spend;
        
        // Transfer SUI to user
        let withdraw_coin = coin::take(&mut user_points.sui_balance, sui_to_withdraw, ctx);
        transfer::public_transfer(withdraw_coin, tx_context::sender(ctx));

        // Emit withdraw event
        event::emit(PointsWithdrawEvent {
            user: tx_context::sender(ctx),
            sui_amount: sui_to_withdraw,
            points_spent: points_to_spend
        });
    }


    public fun get_points(user_points: &UserPoints): u64 {
        user_points.points
    }

    public fun get_sui_balance(user_points: &UserPoints): u64 {
        balance::value(&user_points.sui_balance)
    }

    public fun get_owner(user_points: &UserPoints): address {
        user_points.owner
    }

    public entry fun update_points(
        user_points: &mut UserPoints,
        points_to_update: u64,
        _ctx: &mut TxContext
    ) {
        user_points.points = points_to_update;
    }

}