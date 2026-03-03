#region ===== FIREWALL CONFIGURATION =====
# Function to configure Windows Firewall
function Disable-WindowsFirewallDomainPrivate {
    Clear-Host
    Write-CenteredOutput "Windows Firewall" -color "Info"

    # Get current status
    $profiles = @("Domain", "Private", "Public")

    Write-OutputColor "Current firewall status:" -color "Info"
    foreach ($fwProfile in $profiles) {
        $state = (Get-NetFirewallProfile -Profile $fwProfile -ErrorAction SilentlyContinue).Enabled
        $isEnabled = ($state -eq $true)
        $stateText = if ($isEnabled) { "Enabled" } else { "Disabled" }
        $color = switch ($fwProfile) {
            "Public" { if ($isEnabled) { "Success" } else { "Warning" } }
            default { if ($isEnabled) { "Warning" } else { "Success" } }
        }
        Write-OutputColor "  $fwProfile : $stateText" -color $color
    }

    Write-OutputColor "" -color "Info"
    Write-OutputColor "  [1] Apply recommended (Domain=Off, Private=Off, Public=On)" -color "Success"
    Write-OutputColor "  [2] Toggle individual profile" -color "Info"
    Write-OutputColor "  [B] ◄ Back" -color "Info"
    Write-OutputColor "" -color "Info"

    $choice = Read-Host "  Select"
    $navResult = Test-NavigationCommand -UserInput $choice
    if ($navResult.ShouldReturn) { return }

    # Capture previous state for undo
    $previousStates = @{}
    foreach ($fwProfile in $profiles) {
        $previousStates[$fwProfile] = (Get-NetFirewallProfile -Profile $fwProfile -ErrorAction SilentlyContinue).Enabled -eq $true
    }

    switch ($choice) {
        "1" {
            if (-not (Confirm-UserAction -Message "Apply recommended firewall configuration?")) {
                Write-OutputColor "Firewall configuration cancelled." -color "Info"
                return
            }

            try {
                Set-NetFirewallProfile -Profile Domain -Enabled False -ErrorAction Stop
                Write-OutputColor "  Domain firewall: Disabled" -color "Success"
                Set-NetFirewallProfile -Profile Private -Enabled False -ErrorAction Stop
                Write-OutputColor "  Private firewall: Disabled" -color "Success"
                Set-NetFirewallProfile -Profile Public -Enabled True -ErrorAction Stop
                Write-OutputColor "  Public firewall: Enabled" -color "Success"

                Add-SessionChange -Category "Security" -Description "Configured firewall (Domain/Private disabled, Public enabled)"
                Clear-MenuCache
                # Register undo
                Add-UndoAction -Category "Security" -Description "Firewall: Domain/Private disabled, Public enabled" -UndoScript {
                    param($States)
                    foreach ($p in $States.Keys) {
                        Set-NetFirewallProfile -Profile $p -Enabled $States[$p] -ErrorAction SilentlyContinue
                    }
                }.GetNewClosure() -UndoParams @{ States = $previousStates }
            }
            catch {
                Write-OutputColor "Failed to configure firewall: $_" -color "Error"
            }
        }
        "2" {
            Write-OutputColor "" -color "Info"
            Write-OutputColor "  Select profile to toggle:" -color "Info"
            $idx = 1
            foreach ($fwProfile in $profiles) {
                $state = if ($previousStates[$fwProfile]) { "Enabled" } else { "Disabled" }
                Write-OutputColor "  [$idx] $fwProfile (currently: $state)" -color "Info"
                $idx++
            }
            Write-OutputColor "" -color "Info"
            $profileChoice = Read-Host "  Select (1-3)"

            $selectedProfile = switch ($profileChoice) {
                "1" { "Domain" }
                "2" { "Private" }
                "3" { "Public" }
                default { $null }
            }

            if (-not $selectedProfile) {
                Write-OutputColor "  Invalid choice." -color "Error"
                return
            }

            $currentState = $previousStates[$selectedProfile]
            $newState = -not $currentState
            $action = if ($newState) { "Enable" } else { "Disable" }

            if (-not (Confirm-UserAction -Message "$action $selectedProfile firewall profile?")) {
                return
            }

            try {
                Set-NetFirewallProfile -Profile $selectedProfile -Enabled $newState -ErrorAction Stop
                $stateText = if ($newState) { "Enabled" } else { "Disabled" }
                Write-OutputColor "  $selectedProfile firewall: $stateText" -color "Success"
                Add-SessionChange -Category "Security" -Description "Firewall $selectedProfile profile: $stateText"
                Clear-MenuCache
                Add-UndoAction -Category "Security" -Description "Firewall $selectedProfile toggled to $stateText" -UndoScript {
                    param($Prof, $OldState)
                    Set-NetFirewallProfile -Profile $Prof -Enabled $OldState -ErrorAction SilentlyContinue
                }.GetNewClosure() -UndoParams @{ Prof = $selectedProfile; OldState = $currentState }
            }
            catch {
                Write-OutputColor "  Failed: $_" -color "Error"
            }
        }
        default { return }
    }
}
#endregion