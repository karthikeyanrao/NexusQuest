use anchor_lang::prelude::*;

#[error_code]
pub enum PointsError {
    #[msg("Deposit amount is too small.")]
    InsufficientDeposit,
    #[msg("Not enough points.")]
    InsufficientPoints,
    #[msg("Not enough SOL balance.")]
    InsufficientSOLBalance,
}
